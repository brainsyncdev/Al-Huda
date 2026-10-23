# AL-HUDA — الهدى
## Product Requirements Document (PRD)
### Version 1.0 | Confidential

---

> *"ذَٰلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ هُدًى لِّلْمُتَّقِينَ"*
> *"This is the Book — no doubt — a Guidance for all."*
> — Al-Baqarah 2:2

---

## DOCUMENT INFORMATION

| Field | Detail |
|---|---|
| Product Name | Al-Huda (الهدى) |
| Tagline | "The Book That Speaks To You" |
| Version | 2.0 — COMPLETE |
| Status | Pre-Development |
| Founder | Dawood (House of Solutions) |
| Stack | Next.js + Flutter + NestJS |
| Target Launch | Q3 2025 (MVP) |

---

## TABLE OF CONTENTS

1. Vision & Mission
2. Problem Statement
3. Target Users
4. Product Overview — 3 Modes
5. Core Features (Detail)
6. Data Architecture
7. AI/ML Layer
8. Technical Stack
9. Database Schema
10. API Design
11. User Flows
12. Web — Next.js
13. Mobile — Flutter
14. Monetization
15. Scholar Partnership Plan
16. Content Strategy & NotebookLM Pipeline
17. Launch Strategy
18. 12-Month Roadmap
19. Risk & Mitigation
20. Success Metrics

---

# SECTION 01 — VISION & MISSION

## 01.1 Vision

> *"Al-Huda is the world's first Living Quran — a complete, interconnected knowledge system that connects every human being — Muslim or not — to the full breadth of Quranic guidance, personalized to their life."*

## 01.2 Mission

Muslims today recite the Quran without understanding it. Non-Muslims want to learn about Islam but find no trustworthy, pressure-free entry point. Children grow up hearing Arabic without ever connecting to its meaning. Madrasahs have divided knowledge into "religious" and "worldly" — a division the Quran itself never made.

Al-Huda exists to:

- Reconnect Muslims to the **complete** Quran — all 6,236 ayaat — not just 5 topics
- Give Non-Muslims a **judgment-free** door to discover Quranic wisdom
- Teach children Arabic through **story and wonder** — the way mothers teach
- Rebuild the broken bridge between **Quranic knowledge and daily life**
- Restore the Islamic tradition of **unified knowledge** — where medicine, governance, science, and spirituality are all part of one divine system

## 01.3 The Core Insight

```
The Quran was revealed as a complete life system.
1400 years later — we use it as a ritual checklist.

Al-Huda gives it back — whole.
```

## 01.4 Why Now

- **1.8 billion Muslims** — majority do not understand what they recite
- **Growing Non-Muslim interest** in Islam — no trustworthy digital product exists
- **Gen Z Muslims** — disconnected, searching for meaning, need modern interface
- **No serious competitor** has built personalization + knowledge graph + authentic data together
- **AI + Graph technology** now makes this possible at near-zero cost

## 01.5 The Islamic Foundation

Allah said in the Quran:

**On understanding:**
> *"أَفَلَا يَتَدَبَّرُونَ الْقُرْآنَ"*
> "Do they not reflect on the Quran?" — Muhammad 47:24

**On knowledge being universal:**
> *"اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ"*
> "Read — in the name of your Lord who created" — Al-Alaq 96:1
> *(First revelation — not "read only Quran" — read everything in Allah's name)*

**On thinking:**
> *"أَفَلَا تَعْقِلُونَ"* — "Do you not reason?" — 49 times in Quran

**On knowledge:**
> *"وَعَلَّمَ آدَمَ الْأَسْمَاءَ كُلَّهَا"*
> "Allah taught Adam the names of ALL things" — Al-Baqarah 2:31

---

# SECTION 02 — PROBLEM STATEMENT

## 02.1 The Tilawat Trap

**The most common Muslim experience:**

```
Open Quran app → Read Arabic beautifully → Close app → Know nothing more
Repeat for 30 years.
```

Tilawat (recitation) has reward — but the Quran's primary purpose was **transformation**, not recitation. Allah used the word "tadabbur" (deep reflection) — not "tilawat" — when describing how the Quran should be engaged.

**Evidence:**
- Hafiz who cannot explain a single ayah — common
- Muslims who recite Taraweeh 20 rakaat nightly — understand zero
- Children memorizing Quran with zero meaning — standard practice

## 02.2 The Fragmentation Problem

Current apps treat Quran as **read-only content**. There is no:
- Connection between ayaat and user's life
- Connection between ayaat and each other thematically
- Personalized guidance based on user's situation
- Learning pathway from zero Arabic to understanding

## 02.3 The "5 Numbers" Problem

Certain Islamic movements have reduced the entire Quran to a handful of topics — worship rituals, chilla, gasht, ijtima. The remaining 6,000+ ayaat on:

- Economics and trade ethics
- Governance and justice
- Science and intellectual inquiry
- Mental health and emotional healing
- Interfaith relations and dialogue
- Jihad — its real, multi-layered meaning
- Environmental responsibility

...are labeled "secondary" or "worldly" — and ignored.

## 02.4 The Madrasah Division

Classical Islamic scholarship divided knowledge into:
- **Uloom al-Deen** — Religious sciences (Quran, Hadith, Fiqh) — "real ilm"
- **Funoon** — Other sciences (medicine, math, philosophy) — "tools"

This division is a **post-colonial construct**, not a Quranic one. During the Islamic Golden Age (750-1250 CE), Ibn Sina was simultaneously a physician, philosopher, and Quran scholar. Al-Khawarizmi invented algebra as an expression of his understanding of divine order. The division happened after the Mongol destruction of Baghdad and the subsequent colonial period, when Muslims became defensive and siloed.

Al-Huda restores the unified model: **all knowledge is Allah's knowledge.**

## 02.5 The Non-Muslim Gap

Non-Muslims seeking to understand Islam face:
- Biased media — negative framing
- Defensive Muslims — reactive, not inviting
- Academic texts — dry, inaccessible
- No personalized, pressure-free digital experience

**The result:** Misconceptions persist. Bridges never built.

## 02.6 The Children Gap

Islamic children's education today:
- Qaida → Naazira → Ratta memorization
- Zero meaning, zero connection
- Completion rate: negligible
- Engagement: low

Children can name every Pokemon — but not explain Surah Al-Fatiha.

## 02.7 Problem Summary Table

| Problem | Affected Users | Current Solution | Why It Fails |
|---|---|---|---|
| Tilawat without understanding | 1B+ Muslims | Side-by-side translation | Flow breaks, passive |
| Quran reduced to 5 topics | Practicing Muslims | None | Not addressed |
| No personalized guidance | All Muslims | None | Not built |
| Non-Muslims need entry point | 5B+ humans | None | Not built |
| Children disconnected | Muslim kids | Ratta system | Boring, no meaning |
| Knowledge division | Educated Muslims | None | Structural problem |
| Arabic inaccessible | Non-Arabic speakers | Grammar books | Too hard, too slow |

---

# SECTION 03 — TARGET USERS

## 03.1 Three Primary Modes

Al-Huda serves three distinct user types through three distinct modes within one application.

---

### MODE 1 — NOOR (نور) — Kids Age 3-12

**Who:** Muslim children, taught by parents

**Pain:** Arabic is foreign. Quran is ritual. No emotional connection.

**Goal:** Fall in love with Quran through story before they can even read.

**Persona: Hania, 7, Lahore**
- Goes to Quran class — learns to read Arabic
- Zero understanding of what she reads
- Loves cartoons, stories, interactive games
- Parents want Islamic foundation but existing apps are boring

**Success:** Hania recognizes Arabic root words while watching cartoons. She asks her parents "Ammi — yeh Quran wala lafz hai na?"

---

### MODE 2 — FAHM (فهم) — Muslims Age 13+

**Who:** Muslims who recite but do not understand. Hafiz, students, professionals, housewives, elderly.

**Pain:** Reciting for decades without knowing what Allah is saying.

**Goal:** Understand every word of their daily recitation. Feel Quran come alive.

**Persona A: Bilal, 16, Karachi**
- Goes to madrasa part-time
- Knows Quran by heart — zero meaning
- Wants to understand but finds classical tafsir boring
- Learns best through stories and visual content

**Persona B: Dawood, 30s, Pakistan**
- Leads Taraweeh prayers
- Recites 20 rakaat nightly in Ramadan
- Realizes he understands nothing he recites
- Wants personal transformation through Quran

**Persona C: Amina, 45, UK**
- Practicing Muslim, 5 prayers daily
- Feels prayers are mechanical, no khushu
- Wants to feel what she's saying in namaz

**Success:** Bilal cries in Taraweeh for the first time because he knows what the imam is reciting.

---

### MODE 3 — EXPLORE (کشف) — Non-Muslims & Seekers

**Who:** Non-Muslims curious about Islam. Also Muslims who grew up secular and are returning.

**Pain:** No trustworthy, pressure-free entry point. Media is biased. Muslims are defensive.

**Goal:** Discover Quranic wisdom on their own terms, at their own pace.

**Persona A: James, 28, UK**
- Software developer, atheist background
- Read about Islam after seeing Muslim colleagues
- Wants to understand — not convert — just understand
- Needs: Zero pressure, intellectual approach, honest answers

**Persona B: Priya, 32, India**
- Hindu background, spiritually curious
- Friend is Muslim — wants to understand their faith
- Needs: Respectful framing, comparative context

**Persona C: Ahmed, 25, France**
- Born Muslim, secular upbringing
- Having existential crisis — returning to roots
- Needs: Modern language, no guilt, intellectual entry

**Success:** James shares an ayah on LinkedIn. "I'm not Muslim but this 1400-year-old book just described my situation perfectly."

---

## 03.2 Secondary Users

| User | Use Case |
|---|---|
| Islamic scholars | Research tool — cross-reference ayaat |
| Imams | Sermon preparation — thematic connections |
| Islamic teachers | Classroom tool — visual learning |
| Dawah workers | Evidence-based conversations with non-Muslims |
| Researchers | Academic study of Quranic themes |

---

# SECTION 04 — PRODUCT OVERVIEW

## 04.1 The One-Line Description

> *"Type one word from your life. The Quran speaks back — complete, connected, personalized."*

## 04.2 The Three Modes

```
┌─────────────────────────────────────────────────────┐
│                   AL-HUDA  الهدى                    │
│            "The Book That Speaks To You"            │
├─────────────────────────────────────────────────────┤
│                                                     │
│   🌙 NOOR          📖 FAHM          🔍 EXPLORE      │
│    نور               فهم               كشف          │
│                                                     │
│   Kids             Muslim            Non-Muslim     │
│   Age 3-12         Age 13+           Any Age        │
│                                                     │
│   Story Mode       Tilawat+          Discovery      │
│   Arabic Learn     Understanding     Journey        │
│   Ammi Voice       Life Guidance     No Pressure    │
│   Games            Hifz Engine       Wisdom Lens    │
│                                                     │
│   ─────────────────────────────────────────────     │
│         Shared Core: Living Knowledge Graph         │
│              6,236 Ayaat × 10 Dimensions            │
│                  All Connected                      │
└─────────────────────────────────────────────────────┘
```

## 04.3 The 10 Dimensions of Quran

Every ayah in Al-Huda is tagged across 10 life dimensions:

| # | Dimension | Arabic | What It Covers |
|---|---|---|---|
| 1 | Spiritual | روحاني | Allah, Ibadah, Tawakkul, Akhirah |
| 2 | Personal | شخصي | Mental health, self-development, emotions |
| 3 | Family | أسري | Marriage, parenting, divorce, rights |
| 4 | Social | اجتماعي | Justice, community, rights of others |
| 5 | Economic | اقتصادي | Trade, contracts, riba, wealth |
| 6 | Intellectual | عقلي | Science, critical thinking, knowledge |
| 7 | Governance | سياسي | Leadership, shura, accountability |
| 8 | Jihad | جهاد | Nafs, qalam, maal, sayf — all 4 levels |
| 9 | Interfaith | تعددي | Other religions, dialogue, common ground |
| 10 | Ilm | علم | All knowledge as Allah's signs |

## 04.4 The Living Knowledge Graph

```
Every ayah is a NODE.
Every connection is an EDGE.

Connections are of 5 types:

1. THEMATIC — same topic
   (all "sabr" ayaat connected)

2. ROOT WORD — same Arabic root
   (all ص-ب-ر root ayaat connected)

3. STORY — same narrative
   (all Yusuf AS ayaat connected)

4. EMOTION — same human feeling
   (all "loneliness" ayaat connected)

5. LIFE CONTEXT — same situation
   (all "business loss" ayaat connected)
```

**Result:** Pull any thread — the whole tapestry reveals itself.

## 04.5 Platform

| Platform | Purpose | Priority |
|---|---|---|
| Flutter (Android) | Primary daily use — mobile | Phase 1 |
| Next.js (Web) | Discovery, SEO, graph explorer | Phase 1 |
| Flutter (iOS) | Apple market | Phase 2 |

---

# SECTION 05 — CORE FEATURES (DETAIL)

## 05.1 NOOR MODE — Kids Features

### Feature N-01: Ammi Voice Storytelling

**Description:** Quranic stories narrated in warm Urdu, as if a mother is telling a bedtime story. The voice is AI-generated but trained to sound gentle, loving, unhurried.

**Story Structure:**
```
Opening hook — "Beta, ek baar..."
Character introduction — emotional, visual
Conflict — child-level drama
Arabic word appears — IN the story, not separate
Meaning immediately in Urdu
Story continues — word reinforced naturally
Moral — simple, one sentence
Dua — bedtime connection
```

**Key Principle:** Arabic words are NEVER extracted from the story. They appear within the narrative flow. The child absorbs meaning without realizing they are "learning."

**Stories Library (Phase 1 — 10 stories):**
1. Hazrat Yusuf AS — Patience, trust, forgiveness
2. Hazrat Nuh AS — Perseverance, family
3. Hazrat Ibrahim AS — Courage, questioning, faith
4. Hazrat Musa AS — Leadership, fear, divine support
5. Hazrat Isa AS — Miracles, compassion
6. Hazrat Yunus AS — Mistakes, repentance, new beginnings
7. Hazrat Maryam AS — Strength, trust, honor
8. Ashab al-Kahf — Conviction, youth, divine protection
9. Hazrat Sulaiman AS — Wisdom, gratitude, power
10. The People of the Elephant — Divine justice

### Feature N-02: Root Word Integration (In-Story)

**Description:** Every story introduces 2-3 Arabic root words organically.

**Format within story:**
```
"Yusuf ne kaha:

  رَأَيۡتُ
  'Maine dekha...'

  [Root: ر-أ-ي = Dekhna]
  رَأَيۡتُ — maine dekha
  يَرَى    — woh dekhta hai
  رُؤۡيَا  — khwaab

Yeh lafz Quran mein 328 baar aaya hai."

Story continues naturally.
```

**Why roots matter:**
- Quran has ~2,000 unique root words
- 500 roots = 70% of all Quran
- Child learns 500 roots = reads 70% of Quran with understanding
- Each story: 3 roots × 10 stories = 30 roots (Phase 1)
- Full library: 500 roots taught through 167 stories

### Feature N-03: Interactive Ayah Moments

**Description:** At key story moments, the actual Quranic ayah appears — word by word — highlighted in sync with audio recitation.

**Format:**
```
Beautiful recitation plays.
Each word lights up as it is recited.
Below each word: Urdu meaning.
Child sees Arabic + hears Arabic + sees meaning.
Simultaneously.
```

### Feature N-04: Character System — Noor & Dadi Jan

**Noor** — 7-year-old child character. Curious, sometimes scared, always learning. The child's avatar in every story.

**Dadi Jan** — Noor's grandmother. Warm, loving, patient. The narrator. Every story is told by Dadi Jan to Noor.

**Roshni** — A magical firefly. Appears when a new Arabic word is introduced. Glows when the word recurs in later stories. Acts as the child's "word memory."

### Feature N-05: Micro-Games (Post-Story)

After each story — 3 quick games (2 minutes total):

**Game 1 — Word Match:**
Arabic word ↔ Urdu meaning (tap to match)

**Game 2 — Story Question:**
Simple comprehension question with 3 options

**Game 3 — Repeat After Me:**
Child recites the key ayah — mic records — positive feedback

### Feature N-06: Parent Dashboard

Parents see on web or app:
- Stories completed
- Arabic words learned (cumulative)
- Streak
- "Ask your child tonight:" — conversation starter based on today's story
- Ayah of the week — to practice at home

### Feature N-07: Taraweeh Prep for Kids (Ramadan)

Special Ramadan mode:
- One para story summary per day
- 5 key words from that para
- "Tonight in Taraweeh you will hear..."
- After Taraweeh: "Did you hear it?"

### Feature N-08: Personalized Story Generator

**Description:** Parent describes their child's real situation. App generates a personalized Quranic story — child's name, exact situation, authentic ayah — delivered in Dadi Jan's voice.

**Why it works:**
```
Generic: "Jhooth mat bolo — Allah nahi chahta"
Personalized: "Hania — bilkul tumhari tarah ek bachi thi —
               usne Sara se jhooth bola — aur phir..."
```
The child hears their own name, their own situation — and Quran's answer feels personal.

**Authentic safety guarantee:**
- AI fills scholar-approved templates ONLY
- Ayaat are pre-verified — AI cannot change them
- No Islamic content generated from scratch
- Post-generation auto-check: ayah intact? ✅ no additions? ✅
- See Section 07.5b for full technical pipeline

**Parent flow:**
```
Tap "Mere bachay ke liye story banao"
↓
Child name + age
↓
"Kya hua?" — free text OR select situation:
[Jhooth bola] [Gussa aya] [Chori ki]
[Bhai se jhagda] [Dost ko hurt kiya]
[Namaz nahi parhi] [Khana waste kiya] [+more]
↓
Story generates in ~10 seconds
↓
Dadi Jan voice reads it
↓
Child's name throughout
↓
Save to child's personal story library
```

**Situation coverage (Phase 1 — 20 situations, scholar approved):**
Lying, anger, stealing, sibling conflict, bullying, neglecting namaz, wasting food, disrespecting parents, jealousy, breaking promises, cheating in games, not sharing, hurting animals, showing off, ingratitude.

**Cost:** ~$0.001 per story (GLM Flash via LiteLLM). Ref: Section 07.5b.

### Feature N-09: AI Provider Selection (Parent Settings)

**Description:** Parents can choose which AI provider generates their child's stories. Via LiteLLM gateway — 100+ providers supported.

**Ref:** `BerriAI/litellm` — github.com/BerriAI/litellm — MIT License

```
Settings → AI Provider:

● Al-Huda Default (GLM-4-Flash) — Recommended
  Fast, cheap, works out of the box

○ My OpenAI Key — Paste API key
○ My Gemini Key — Paste API key
○ My Anthropic Key — Paste API key
○ Local (Ollama) — For advanced users
  Full privacy — no data leaves device
```

**Privacy note shown to all users:**
"Al-Huda never stores story generation prompts containing your child's information beyond the active request. BYOK users: your data goes directly to your chosen provider under their terms."

---

## 05.2 FAHM MODE — Muslim Features

### Feature F-01: Flowing Tilawat Mode

**Description:** The primary reading experience. Arabic text flows continuously. After each ayah — a 3-part insight appears inline — without breaking reading flow.

**Format per ayah:**
```
[Arabic text — full, beautiful]

📖 Matlab: [Simple Urdu meaning — 1 line]
🕌 Context: [Why this ayah came — 1 line]
⚡ Aaj ke liye: [One practical connection — 1 line]

[Next ayah...]
```

**Depth slider:**
- Beginner: Only "Matlab" (meaning)
- Intermediate: Matlab + Context
- Advanced: All three + tafsir link
- Scholar: Full Ibn Kathir reference

### Feature F-02: Word-by-Word Breakdown

Any ayah — tap to expand:
- Each Arabic word highlighted
- Root word shown
- Urdu meaning
- Grammar note (simple)
- Other ayaat with same root

### Feature F-03: Root Word Learning (Adult Version)

**500 Roots Curriculum:**

Organized by frequency in Quran:
- Level 1: Top 50 roots (covers 40% of Quran)
- Level 2: Roots 51-150 (covers 60% of Quran)
- Level 3: Roots 151-350 (covers 70% of Quran)
- Level 4: Complete 500 roots (covers 75%+ of Quran)

Each root:
```
Root: ع-ل-م (Knowledge)

Core meaning: To know, to learn

In Quran:
عَلِمَ   — He knew
يَعْلَمُ  — He knows
عِلْم    — Knowledge
عَالِم   — One who knows
عَلَّمَ   — He taught
مَعْلُوم  — Known thing

Frequency: 854 times in Quran
First appearance: Al-Baqarah 2:31

"وَعَلَّمَ آدَمَ الْأَسْمَاءَ كُلَّهَا"
"Allah taught Adam the names of all things"
```

### Feature F-04: Taraweeh Mode

**Pre-Ramadan preparation:**
- 30-day program — one juz per day
- Each juz: 5 key themes, 10 key words, 3 emotional ayaat
- Audio: "Tonight in Taraweeh you will hear Imam recite..."
- Morning notification: "Aaj ka juz — Al-Baqarah 1-20"

**During Taraweeh:**
- Offline mode — no internet needed
- Follow along silently
- Each ayah — Urdu meaning appears
- No distraction — just meaning

**After Taraweeh:**
- "Which ayah hit your heart tonight?"
- Save to personal journal
- Connects to Knowledge Graph

### Feature F-05: Life Context System

**Setup (onboarding):**
User provides personal context:
- Profession (doctor, engineer, teacher, business, student)
- Current life situation (stress, loss, new beginning, marriage, parenthood)
- Goals (peace, success, guidance, healing)
- Age bracket

**Personalized lens:**
Every ayah gets an additional insight:
```
User is: Business owner, solar industry

Surah Al-Baqarah 2:282:
Standard: "Document your transactions"

Personalized:
"Apni solar deals mein — 
 har contract written hona chahiye.
 Yeh ayah business documentation
 ka divine command hai."
```

### Feature F-06: Guidance Mode

**Description:** User describes their current situation. App finds relevant ayaat from authenticated sources.

**Flow:**
```
User types: "Mere partner ne dhoka diya
             business mein — kya karoon?"

App (via RAG on authentic tafsir):
Relevant ayaat retrieved:
1. On betrayal — 4:105
2. On patience — 2:153  
3. On Allah's plan — 65:3
4. On moving forward — 94:5-6

Each with:
- Arabic
- Urdu meaning  
- Ibn Kathir context
- Practical guidance
- Connected ayaat (graph)

Footer: "Specific fiqhi masail ke liye 
        kisi alim se zaroor milein."
```

### Feature F-07: Hifz Engine

**Smart memorization system:**

- Spaced repetition — Ebbinghaus curve
- Weak spot detection — which ayah you always stumble on
- Time optimization — Fajr vs Isha different retention
- Mistake pattern — "You always pause at this word"
- Progress honest tracking — no fake streaks

**Memorization modes:**
1. Listen & Repeat — audio first
2. Blanks — fill in the missing word
3. First word prompt — remember rest
4. Full recitation — record and compare

### Feature F-08: Personal Quran Journal

- Tag any ayah to a life moment
- Add personal note
- Date-stamped
- Becomes a personal history: "This ayah — this moment — this feeling"
- Revisit yearly — see how you've grown

### Feature F-09: Namaz Companion

For every ayah recited in namaz (Fatiha, last 3 surahs, common ayaat):
- What you are saying — word by word
- What it means
- Why it matters in the context of standing before Allah

**Goal:** Every rakaat becomes conscious. Khushu increases.

---

## 05.3 EXPLORE MODE — Non-Muslim Features

### Feature E-01: Personalized Discovery Onboarding

**No religious pressure in any of this.**

```
Step 1: "Tell us about yourself"
Profession → Doctor / Engineer / Parent / Student / Artist / Other

Step 2: "What brings you here?"
→ Just curious about Islam
→ Have Muslim friends/family
→ Heard something about Quran
→ Searching for meaning/peace
→ Academic research

Step 3: "What matters most to you right now?"
→ Peace and mental wellbeing
→ Justice and fairness in the world
→ Understanding different cultures
→ Science and knowledge
→ Family and relationships
→ Ethics in business

Step 4: App personalizes Quran discovery
based on these answers.
```

### Feature E-02: Quran Discovery Feed

Not a reading app — a discovery experience.

```
"You said justice matters to you.

1400 years ago, the Quran said:

يَا أَيُّهَا الَّذِينَ آمَنُوا كُونُوا 
قَوَّامِينَ بِالْقِسْطِ شُهَدَاءَ لِلَّهِ

'O you who believe — be persistently 
standing firm in justice — 
witnesses for Allah — 
even if it be against yourselves 
or parents or relatives'
— An-Nisa 4:135

This verse was revealed when a Muslim man
tried to protect his own family member
from a justified verdict.
Allah said: Justice first. Always."

[Save] [Share] [Explore connected ayaat]
```

### Feature E-03: Misconceptions Section

Direct, honest, source-based answers:

- "Does Islam promote violence?"
- "What does Jihad actually mean?"
- "Does Islam oppress women?"
- "What does Islam say about other religions?"
- "Is Allah the same as God?"

Each answered:
- Directly from Quran — ayah cited
- Historical context
- What mainstream Islamic scholarship says
- No defensiveness, no preaching

### Feature E-04: "Quran vs. What I Heard" Feature

User inputs a claim they've heard about Islam:
```
"I heard Islam says to kill non-believers"

App:
"Let's look at what the Quran actually says.

The ayah most often quoted in this context:
Al-Baqarah 2:191

Full context: This was revealed during a 
specific battle situation in early Islamic 
history. The preceding ayah (2:190) says:
'Fight only those who fight you — 
and do not transgress limits'

The Quran also says (Al-Mumtahanah 60:8):
'Allah does not forbid you from being kind
and just to those who have not fought you'

Ibn Kathir (classical scholar) explains..."
```

### Feature E-05: Compare & Reflect

For spiritually curious non-Muslims:
- How does Quran's view on [topic] compare to [other tradition]?
- Similarities and differences — respectfully presented
- No "Islam is better" framing
- User draws own conclusions

### Feature E-06: Save & Share

Any ayah — save to personal collection.
Share as beautiful card — Arabic + translation + source.
No Al-Huda branding pressure — clean, shareable.

---

## 05.4 CROSS-MODE FEATURES

### Feature X-01: Living Knowledge Graph (Visual)

**Available on Web primarily, simplified on mobile.**

```
Central node: Any ayah / theme / word / situation

Connections radiate outward:
- Same theme ayaat
- Same root word ayaat
- Related stories
- Connected dimensions
- Linked hadiths

Filters:
- By dimension (Spiritual / Economic / etc.)
- By surah
- By root word
- By emotion
- By life context
```

**Interaction:**
- Tap any node — it becomes the center
- Infinite depth — every ayah leads to more
- Save any map — personal knowledge collection

### Feature X-02: 10 Dimensions Explorer

Home screen shows 10 dimensions as circles.

Tap "Economic":
```
ECONOMIC DIMENSION
━━━━━━━━━━━━━━━━━

Trade Ethics (23 ayaat)
Contracts & Documentation (8 ayaat)
Riba — Why Forbidden (12 ayaat)
Wealth Distribution (18 ayaat)
Rights of Employees (6 ayaat)
Honest Measurement (7 ayaat)
Avoiding Waste (9 ayaat)

Ibn Khaldun connection:
"Father of Economics — his theories
 rooted entirely in Quranic economics"
```

### Feature X-03: Daily Quran — 5 Minutes

```
Every day:
1 Root Word (with 3 example ayaat)
1 Thematic connection (unexpected)
1 "Did you know?" — Quran + modern science
1 Action item

"Today's root: ر-ح-م (Mercy)
 Appears 338 times in Quran
 First word of Quran after Bismillah
 
 Today's action:
 Do one act of mercy for someone
 who cannot repay you."
```

### Feature X-04: Family Mode

One account — multiple profiles:
- Each family member their mode
- Family dashboard — shared progress
- "Tonight's dinner question" — based on today's content
- Weekly family insight

### Feature X-05: Tafsir Depth Levels

Every ayah has 4 layers accessible:

| Level | Content | Source |
|---|---|---|
| Simple | 1-line Urdu meaning | Tafsir Muyassar |
| Context | Why revealed + historical | Al-Wahidi (Sabab e Nuzool) |
| Deep | Detailed explanation | Ibn Kathir / Al-Sa'di |
| Scholar | Full classical Arabic tafsir | Al-Tabari |

---

## 05.5 REFERENCE DISPLAY STANDARD — Mandatory UI Rule

> **Every single piece of Islamic content in Al-Huda — ayah, hadith, tafsir, story, guidance — must show its complete reference. No exceptions. User must be able to verify any claim in one tap.**

This is not optional. It is a core product principle equal in importance to design or performance.

---

### 05.5.1 Ayah Reference Card

**Every ayah shown anywhere in the app — tilawat, guidance, story, search result — shows:**

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  إِنَّ اللَّهَ مَعَ الصَّابِرِينَ                  │  ← Arabic (full tashkeel)
│                                                     │
│  "بیشک اللہ صبر کرنے والوں کے ساتھ ہے"            │  ← Urdu (Jalandhari)
│                                                     │
├─────────────────────────────────────────────────────┤
│ 📖 Al-Baqarah  •  Ayah 153  •  Juz 2  •  Page 23  │
│ 🕌 Revealed in: Madinah                             │
├─────────────────────────────────────────────────────┤
│ 📚 Tafsir:  [Ibn Kathir ↗]  [Al-Sa'di ↗]           │
│             [Muyassar ↗]   [Tabari ↗]               │
├─────────────────────────────────────────────────────┤
│ 🔗 quran.com/2:153                         [Open ↗] │
└─────────────────────────────────────────────────────┘
```

**Fields breakdown:**

| Field | Source | Example |
|---|---|---|
| Surah name (Arabic + English) | `surahs` table | Al-Baqarah — البقرة |
| Ayah number | `ayahs` table | 153 |
| Juz | `ayahs.juz` | Juz 2 |
| Page | `ayahs.page` | Page 23 |
| Revelation type | `surahs.revelation_type` | Madinah / Makkah |
| Tafsir links | `tafsir_entries.ref_url` | spa5k CDN per scholar |
| External link | `ayahs.ref_url` | quran.com/2:153 |

**Compact mode** (e.g. in stories, notifications):
```
Al-Baqarah 2:153  •  [quran.com ↗]  •  [Ibn Kathir ↗]
```

---

### 05.5.2 Hadith Reference Card

**Every hadith shown anywhere shows:**

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ               │  ← Arabic (full tashkeel)
│                                                     │
│  "اعمال کا دارومدار نیتوں پر ہے"                   │  ← Urdu
│                                                     │
├─────────────────────────────────────────────────────┤
│ 📗 Sahih al-Bukhari  •  Kitab Bad al-Wahy  •  No.1 │
│ ✅ Grade: Sahih                                     │
│ 👤 Rawi: Umar ibn al-Khattab (RA)                  │
├─────────────────────────────────────────────────────┤
│ 🔗 sunnah.com/bukhari:1                    [Open ↗] │
└─────────────────────────────────────────────────────┘
```

**Grade color coding:**
```
Sahih  → ✅ Green
Hasan  → 🟡 Yellow
Da'if  → ⚠️ Orange  +  "Scholars differ on this"
Fabricated → ❌ Never shown
```

**Fields breakdown:**

| Field | Source | Example |
|---|---|---|
| Collection name | `hadiths.collection` | Sahih al-Bukhari |
| Book/Kitab name | `hadiths.book_number` | Kitab Bad al-Wahy |
| Hadith number | `hadiths.hadith_number` | 1 |
| Grade | `hadiths.grade` | Sahih |
| Narrator (Rawi) | `hadiths.narrator` | Umar ibn al-Khattab (RA) |
| External link | `hadiths.ref_url` | sunnah.com/bukhari:1 |

---

### 05.5.3 Tafsir Reference

**Every tafsir snippet shown shows:**

```
┌─────────────────────────────────────────────────────┐
│  "Is ayah mein Allah ne Momineen ko sabr ka          │
│   hukm diya hai kyunke..."                          │
├─────────────────────────────────────────────────────┤
│ ✍️  Ibn Kathir  •  Tafsir al-Quran al-Azeem         │
│     (d. 1373 CE / 774 AH)                           │
│ ✅  Scholar Approved                                 │
│ 🔗  [CDN Source ↗]                                  │
└─────────────────────────────────────────────────────┘
```

---

### 05.5.4 Personalized Story Reference

**In NOOR stories — every embedded ayah shows compact reference:**

```
"...Allah ne farmaya:

 إِنَّ اللَّهَ مَعَ الصَّابِرِينَ
 'Allah sabrr karne walon ke saath hai'

 ┌─ Reference ───────────────────────────┐
 │ Al-Baqarah 2:153  [quran.com ↗]       │
 │ Tafsir: Ibn Kathir [↗]  Al-Sa'di [↗]  │
 └───────────────────────────────────────┘"
```

Child-friendly label: **"Yeh ayah kahan se hai?"** → taps → full reference opens.

---

### 05.5.5 Guidance Mode Reference

**When user gets personalized guidance — every ayah and hadith cited:**

```
User query: "Business mein dhoka hua"

Response:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"Quran mein Allah ne farmaya:

 وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا
 'Jo Allah se darta hai — Allah uske liye
  rasta nikalta hai'

 [At-Talaq 65:2-3 • quran.com/65:2 ↗]
 [Ibn Kathir tafsir ↗]

 Nabi ﷺ ne farmaya:
 'Jab tum dhoka kaho toh tum hamare
  mein se nahi...'

 [Sahih Muslim 101 • sunnah.com/muslim:101 ↗]
 [Grade: Sahih ✅]"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ Specific fiqhi masail ke liye
   kisi alim se zaroor milein.
```

---

### 05.5.6 Knowledge Graph Node Reference

**Every node in the graph — tap → reference panel opens:**

```
[Node: Ayah 2:153]

Tap → Side panel:
┌─────────────────────────┐
│ Al-Baqarah 2:153        │
│ "Sabr wali ayah"        │
│                         │
│ [Read full ayah]        │
│ [quran.com/2:153 ↗]     │
│ [All 4 tafsirs ↗]       │
│ [Connected ayaat: 12]   │
│ [Related hadiths: 3]    │
└─────────────────────────┘
```

---

### 05.5.7 Reference Panel — Flutter Component Spec

**Reusable widget — used across entire app:**

```dart
// ReferenceBar widget — mandatory on all Islamic content
ReferenceBar(
  type: ReferenceType.ayah,  // or .hadith, .tafsir
  surahNumber: 2,
  ayahNumber: 153,
  surahName: "Al-Baqarah",
  revelationType: "Madinah",
  juz: 2,
  page: 23,
  externalUrl: "https://quran.com/2:153",
  tafsirLinks: [
    TafsirLink(scholar: "Ibn Kathir", url: "...cdn..."),
    TafsirLink(scholar: "Al-Sa'di",  url: "...cdn..."),
    TafsirLink(scholar: "Muyassar",  url: "...cdn..."),
  ],
  compact: false,  // true = one-line mode for stories
)
```

**Widget states:**
```
compact: false → Full card (tilawat, guidance screens)
compact: true  → One line (stories, notifications)
modal: true    → Full-screen reference sheet (tap "verify")
```

---

### 05.5.8 Reference Panel — Web Component Spec (Next.js)

```tsx
// ReferenceBar component — Next.js
<ReferenceBar
  type="ayah"
  surah={2}
  ayah={153}
  surahName="Al-Baqarah"
  revelationType="Madinah"
  juz={2}
  page={23}
  externalUrl="https://quran.com/2:153"
  tafsirLinks={[
    { scholar: "Ibn Kathir", url: "...cdn..." },
    { scholar: "Al-Sa'di",  url: "...cdn..." },
  ]}
/>
```

**Web — additional SEO benefit:**
Each reference link is a proper `<a href>` tag — Google indexes it — builds domain authority as authentic Islamic source.

---

### 05.5.9 What Is NEVER Shown Without Reference

```
❌ Any Arabic text not from tanzil.net
❌ Any tafsir not from authenticated source
❌ Any hadith without sunnah.com link
❌ Any scholar statement without attribution
❌ Any "Islamic fact" without citation

✅ Everything has:
   → Scholar name
   → Work name
   → Hadith/Ayah number
   → External verification link
   → Scholar approval timestamp (internal)
```

---

### 05.5.10 User Trust Signal

**"Verify Everything" badge in app settings:**

```
Al-Huda Transparency Promise:

"Har ayah — quran.com se verify karein
 Har hadith — sunnah.com se verify karein
 Har tafsir — authenticated scholar source

 Koi bhi cheez blind trust pe nahi.
 Sab kuch ek tap mein verify ho."
```

This badge appears in:
- App onboarding (all 3 modes)
- Settings → About
- Every "Share" card footer

---

# SECTION 06 — DATA ARCHITECTURE

## 06.1 Data Philosophy

```
GOLDEN RULE:
Every single piece of content in Al-Huda
has a verifiable, authentic Islamic source.

AI does NOT generate Islamic content.
AI ONLY retrieves and presents 
existing authenticated content.

Every ayah insight cites its source.
Every tafsir note names its scholar.
Every hadith is graded and attributed.
```

## 06.2 Primary Data Sources

> **Total data cost: $0. ~90% of PRD schema covered by open-source repos.**

---

### Tier 0 — Quran Core (Day 1 Import)

| Repo | What It Has | Format | PRD Tables Covered |
|---|---|---|---|
| `AbdullahGhanem/quran-database` | 114 surahs metadata, 6,236 ayahs Arabic text, multi-translation editions (Urdu Jalandhari, English Saheeh Int'l, Pickthall) | MySQL 187MB + JSON | surahs, ayahs, translations |
| `Abdallah-Mekky/Quran-Database` | tafseer_saadi, tafseer_moysar, tafseer_bughiu, verse meanings, Arabic grammar (i'rab), sabab nuzool (partial), full tashkeel Arabic | SQLite / Android Room | tafsir_entries (3 scholars), sabab_nuzool (partial) |

**Week 1 import plan:**
```
1. AbdullahGhanem → MySQL import → surahs + ayahs + translations done
2. Abdallah-Mekky → extract tafsir columns → merge into tafsir_entries table
3. tanzil.net → cross-verify Arabic text accuracy
4. Result: 6,236 ayaat — Arabic + Urdu + English + 3 tafsirs — Day 1
```

---

### Tier 1 — Translations — 21+ Languages

**Primary Source: `fawazahmed0/quran-api`**
```
github.com/fawazahmed0/quran-api
→ 98 languages, 440+ translations
→ Free CDN via jsDelivr — no API key — no rate limit
→ JSON per ayah
→ Controversial translators excluded by maintainer
```

**CDN pattern:**
```
https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/
editions/{edition}/{surah}/{ayah}.json
```

**Al-Huda selected translations (ahlus sunnah — all authentic):**

| # | Language | Translator | Tradition | Source Slug |
|---|---|---|---|---|
| 1 | **Urdu** | Fateh Muhammad Jalandhari | Deobandi — widely accepted | `urd-jalandhari` |
| 2 | **Urdu** | Abul A'la Maududi | Modern Islamic — widely used | `urd-maududi` |
| 3 | **Urdu** | Ahmed Ali | Classical | `urd-ahmedali` |
| 4 | **English** | Saheeh International | Ahlus Sunnah standard | `eng-sahih` |
| 5 | **English** | Pickthall | Public domain — classical | `eng-pickthall` |
| 6 | **English** | Yusuf Ali | Classical | `eng-yusufali` |
| 7 | **Arabic** | Tafsir Muyassar (meaning) | Saudi Ministry | `ara-muyassar` |
| 8 | **Hindi** | Azizul Haqq | — | `hin-omari` |
| 9 | **Bengali** | Muhiuddin Khan | — | `ben-muhiuddinkhan` |
| 10 | **Turkish** | Diyanet İşleri | Official Turkey | `tur-diyanet` |
| 11 | **French** | Muhammad Hamidullah | — | `fra-hamidullah` |
| 12 | **German** | Abu Rida | — | `deu-aburida` |
| 13 | **Spanish** | Muhammad Isa Garcia | — | `spa-garcia` |
| 14 | **Indonesian** | Kemenag | Official Indonesia | `ind-indonesian` |
| 15 | **Russian** | Elmir Kuliev | — | `rus-kuliev` |
| 16 | **Chinese** | Muhammad Makin | — | `zho-makin` |
| 17 | **Pashto** | Zakaria | Pakistan/Afghanistan | `pus-zakaria` |
| 18 | **Persian/Farsi** | Fooladvand | — | `fas-fooladvand` |
| 19 | **Malay** | Basmeih | Official Malaysia | `msa-basmeih` |
| 20 | **Swahili** | Ali Muhsin | East Africa | `swa-muhsin` |
| 21 | **Tamil** | Jan Trust | South Asia | `tam-jantrust` |

**Also from tanzil.net:** Direct download — JSON/SQL/XML — all same translations verified.
`tanzil.net/trans/` — Free with attribution — CC BY 3.0.

**Islam360 has 21 translations. Al-Huda has 21+ from day 1. Same coverage. $0.**

---

### Tier 2 — Arabic Text Verification

| Source | Content | License |
|---|---|---|
| `tanzil.net` | Hafs an Asim — most peer-reviewed digital Quran. Verified by scholars + huffaz against Medina Mushaf. Used by Quran.com globally. Version 1.1 (Feb 2021). | CC BY 3.0 — free with attribution |

---

### Tier 3 — Tafsir — 16+ Scholars

**Primary Source: `spa5k/tafsir_api`**
```
github.com/spa5k/tafsir_api
→ 27 tafsirs available
→ Free CDN — no rate limit — no API key
→ Per ayah JSON
→ Self-host on Hetzner recommended (copy data folder)
```

**CDN pattern:**
```
https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/
tafsir/{slug}/{surah}/{ayah}.json
```

**Al-Huda selected tafsirs (ahlus sunnah — all schools accept):**

| # | Scholar | Work | Language | Slug | Era | Maslak Acceptance |
|---|---|---|---|---|---|---|
| 1 | **Ibn Kathir** (d.1373) | Tafsir al-Quran al-Azeem | Arabic | `ar-tafsir-ibn-kathir` | Classical | ✅ All schools |
| 2 | **Ibn Kathir** (d.1373) | Abridged English | English | `en-tafisr-ibn-kathir` | Classical | ✅ All schools |
| 3 | **Al-Sa'di** (d.1956) | Taysir al-Karim al-Rahman | Arabic | `ar-tafseer-al-saddi` | Modern | ✅ All schools |
| 4 | **Al-Tabari** (d.923) | Jami al-Bayan | Arabic | `ar-tafsir-al-tabari` | Classical | ✅ All schools |
| 5 | **Al-Baghawi** (d.1122) | Ma'alim al-Tanzil | Arabic | `ar-tafsir-al-baghawi` | Classical | ✅ All schools |
| 6 | **Tafsir Muyassar** | Saudi Ministry | Arabic | `ar-tafsir-muyassar` | Modern | ✅ All schools |
| 7 | **Al-Jalalayn** | Jalal al-Din x2 | Arabic | `ar-tafsir-al-jalalayn` | Classical | ✅ All schools |
| 8 | **Al-Jalalayn** | Jalal al-Din x2 | English | `en-al-jalalayn` | Classical | ✅ All schools |
| 9 | **Al-Wasit** | Al-Wasit | Arabic | `ar-tafsir-al-wasit` | Classical | ✅ All schools |
| 10 | **Dr. Israr Ahmed** | Bayan ul Quran | Urdu | `ur-israr-ahmed` | Modern | ✅ Pakistan accepted |
| 11 | **Wahiduddin Khan** | Tazkirul Quran | Urdu | `ur-tazkirul-quran` | Modern | ✅ Widely accepted |
| 12 | **Tanwir al-Miqbas** | Ibn Abbas attr. | Arabic | `ar-tafseer-tanwir-al-miqbas` | Classical | ✅ |
| 13 | **Al-Qurtubi** | Al-Jami li-Ahkam | Arabic | quran.foundation API | Classical | ✅ All schools |
| 14 | **Ibn Ashur** | Al-Tahrir wal-Tanwir | Arabic | quran.foundation API | Modern | ✅ |
| 15 | **Mufti Shafi Usmani** | Maarifal Quran | Urdu | Abdallah-Mekky repo | Modern | ✅ Deobandi |
| 16 | **Al-Kashaf al-Asrar** | Al-Qushairi | English | `en-al-qushairi-tafsir` | Classical | ✅ |

**Also — quran.foundation API (free):**
```
api-docs.quran.foundation
GET /tafsirs/{tafsir_id}/by_ayah/{surah}:{ayah}
→ Additional scholars
→ No key for basic access
```

**Islam360 has 16 tafsirs. Al-Huda has 16+ from day 1. Same coverage. $0.**

---

### Tier 4 — Hadith — 9 Books (Sihah Sitta + More)

**Primary Source: `AhmedBaset/hadith-json`**
```
github.com/AhmedBaset/hadith-json
→ 17 books, 50,884 hadiths
→ Arabic + English both
→ JSON — by_book and by_chapter layouts
→ Free, no API key
```

**Verification links: `sunnah.com/{collection}:{number}`** — per hadith permalink.

**Complete Collection:**

| # | Book | Arabic Name | Count | Grade | sunnah.com Slug |
|---|---|---|---|---|---|
| 1 | **Sahih al-Bukhari** | صحيح البخاري | ~7,563 | Sahih | `bukhari` |
| 2 | **Sahih Muslim** | صحيح مسلم | ~7,470 | Sahih | `muslim` |
| 3 | **Sunan Abu Dawud** | سنن أبي داود | ~5,274 | Hasan/Sahih | `abudawud` |
| 4 | **Jami al-Tirmidhi** | جامع الترمذي | ~3,956 | Sahih/Hasan | `tirmidhi` |
| 5 | **Sunan al-Nasai** | سنن النسائي | ~5,758 | Sahih/Hasan | `nasai` |
| 6 | **Sunan Ibn Majah** | سنن ابن ماجه | ~4,341 | Hasan | `ibnmajah` |
| 7 | **Muwatta Malik** | موطأ مالك | ~1,594 | Sahih | `malik` |
| 8 | **Musnad Ahmad** | مسند أحمد | ~27,000+ | Mixed | `ahmad` |
| 9 | **Al-Nawawi 40** | الأربعون النووية | 42 | Sahih | `nawawi40` |
| 10 | **Riyad al-Salihin** | رياض الصالحين | ~1,896 | Sahih/Hasan | `riyadussalihin` |
| 11 | **Al-Adab al-Mufrad** | الأدب المفرد | ~1,322 | Mixed | `adab` |
| 12 | **Sunan al-Darimi** | سنن الدارمي | ~3,367 | Sahih/Hasan | `darimi` |

**Hadith display policy:**
```
✅ Sahih  → Show normally — "Sahih" badge green
✅ Hasan  → Show — "Hasan" badge yellow
⚠️ Da'if  → Show labeled — "Scholars differ" — orange
            Never used for guidance/rulings
❌ Fabricated → Never shown
```

**Islam360 has 9 books. Al-Huda has 12 books, 50,884 hadiths. Al-Huda wins. $0.**

---

### Tier 5 — Arabic Root Words & Morphology

| Source | What | Access |
|---|---|---|
| `mustafa0x/quran-morphology` | Fork of Quranic Arabic Corpus v0.4 — every word root + POS + lemma — improved | GitHub free |
| `corpus.quran.com` | Official v0.4 — 77,430 word tokens — GNU license | Free download |
| `islamAndAi/QURAN-NLP` | Top 1000 Quranic words CSV + corpus linguistics | GitHub free |

---

### Tier 6 — Audio Recitations

| Source | Reciters | Access |
|---|---|---|
| `everyayah.com` | 14+ reciters — Mishary, Husary, Abdul Basit, Minshawi, etc. | Free — URL pattern |
| Tarteel AI | 30 reciters — word-level audio | Open dataset |

**URL pattern:** `https://everyayah.com/data/{reciter}/{surah_3digit}{ayah_3digit}.mp3`

---

### Tier 7 — Sabab e Nuzool

| Source | What | Status |
|---|---|---|
| `Abdallah-Mekky/Quran-Database` | `reasons_of_verses` column — partial | ✅ Tier 0 |
| Al-Wahidi — Asbab al-Nuzool | Classical authoritative | NotebookLM process |
| Al-Suyuti — Al-Itqan | Comprehensive | NotebookLM process |

---

### Tier 8 — Science & Quran Policy

**Policy:** Only peer-reviewed mainstream science. No pseudoscience. Ibn Kathir and Al-Sa'di statements only — no modern editorial claims.

---

### Master Coverage Table — Final

| PRD Schema Table | Source | Day 1? |
|---|---|---|
| `surahs` | AbdullahGhanem | ✅ |
| `ayahs` (Arabic + tashkeel) | AbdullahGhanem + Abdallah-Mekky | ✅ |
| `translations` — 21 languages | fawazahmed0/quran-api + tanzil.net | ✅ |
| `tafsir_entries` — Ibn Kathir (AR+EN) | spa5k/tafsir_api | ✅ |
| `tafsir_entries` — Al-Sa'di | spa5k + Abdallah-Mekky | ✅ |
| `tafsir_entries` — Muyassar | spa5k + Abdallah-Mekky | ✅ |
| `tafsir_entries` — Baghawi | spa5k + Abdallah-Mekky | ✅ |
| `tafsir_entries` — Tabari | spa5k/tafsir_api | ✅ |
| `tafsir_entries` — Jalalayn (AR+EN) | spa5k/tafsir_api | ✅ |
| `tafsir_entries` — Dr. Israr + Khan | spa5k/tafsir_api | ✅ |
| `tafsir_entries` — Maarifal Quran | Abdallah-Mekky | ✅ |
| `sabab_nuzool` | Abdallah-Mekky (partial) + NotebookLM | ⚠️ |
| `hadiths` — 12 books 50,884 | AhmedBaset/hadith-json | ✅ |
| `root_words` | mustafa0x + corpus.quran.com | ✅ |
| `ayah_roots` | corpus.quran.com v0.4 | ✅ |
| Audio URLs | everyayah.com (14+ reciters) | ✅ |
| `themes` / `dimensions` | Manual + Scholar | ❌ Build |
| **TOTAL** | | **~92% — $0** |

## 06.3 Data Quality Pipeline

```
STEP 1: SOURCE COLLECTION
Download/scrape authenticated sources
Store in raw format with metadata

STEP 2: SCHOLAR VERIFICATION
Advisory board reviews all content
Especially: tafsir summaries, connections
Approve or flag for revision

STEP 3: NOTEBOOKLM PROCESSING
Authentic PDFs uploaded to NotebookLM
Generate simplified content
Source always cited in output

STEP 4: AI SIMPLIFICATION
GLM Flash processes approved content
Converts classical Arabic tafsir → Simple Urdu
Strict prompt: "Only use provided text. Cite source."

STEP 5: HUMAN REVIEW
Every AI-generated summary reviewed by
at least one Islamic scholar before publish

STEP 6: DATABASE STORAGE
Verified content stored with:
- Source reference
- Permalink URL (see 06.4)
- Scholar approval timestamp
- Version history

STEP 7: CONTINUOUS MONITORING
User flags for errors → Scholar review queue
Any flagged content hidden pending review
```

---

## 06.4 Reference & Permalink URL System

**Every single ayah and hadith in Al-Huda has a verified, clickable, permanent reference link. No content without a source URL.**

---

### Ayah Reference URLs

**Primary source — quran.com (Quran Foundation):**

```
Format: https://quran.com/{surah}:{ayah}

Examples:
Al-Fatiha 1:1   → https://quran.com/1:1
Al-Baqarah 2:255 → https://quran.com/2:255
At-Tawbah 9:119 → https://quran.com/9:119
Ya-Sin 36:1     → https://quran.com/36:1
```

**Tafsir deep-link — per ayah, per scholar:**

```
Format: https://quran.com/{surah}:{ayah}?startingVerse={ayah}

Tafsir API (spa5k) CDN — per ayah JSON:
Ibn Kathir:  https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir/ar-tafsir-ibn-kathir/{surah}/{ayah}.json
Al-Sa'di:   https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir/ar-tafseer-al-saddi/{surah}/{ayah}.json
Muyassar:   https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir/ar-tafsir-muyassar/{surah}/{ayah}.json
Baghawi:    https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir/ar-tafsir-al-baghawi/{surah}/{ayah}.json
Tabari:     https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir/ar-tafsir-al-tabari/{surah}/{ayah}.json
Ibn Kathir EN: https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir/en-tafisr-ibn-kathir/{surah}/{ayah}.json
```

**What user sees in app:**

```
Ayah: Al-Baqarah 2:153
Arabic: إِنَّ اللَّهَ مَعَ الصَّابِرِينَ
Urdu: "بیشک اللہ صبر کرنے والوں کے ساتھ ہے"

Source: [Tanzil.net ↗]  [quran.com/2:153 ↗]
Tafsir: Ibn Kathir [CDN link ↗] | Al-Sa'di [CDN link ↗]
```

---

### Hadith Reference URLs

**Primary source — sunnah.com:**

```
Format: https://sunnah.com/{collection}:{hadith_number}

Collection slugs:
bukhari    → https://sunnah.com/bukhari:{n}
muslim     → https://sunnah.com/muslim:{n}
tirmidhi   → https://sunnah.com/tirmidhi:{n}
abudawud   → https://sunnah.com/abudawud:{n}
nasai      → https://sunnah.com/nasai:{n}
ibnmajah   → https://sunnah.com/ibnmajah:{n}
malik      → https://sunnah.com/malik:{n}
nawawi40   → https://sunnah.com/nawawi40:{n}
riyadussalihin → https://sunnah.com/riyadussalihin:{n}

Examples:
Bukhari 1   → https://sunnah.com/bukhari:1
Muslim 2564 → https://sunnah.com/muslim:2564
Tirmidhi 1 → https://sunnah.com/tirmidhi:1
```

**What user sees in app:**

```
Hadith: Sahih al-Bukhari 52
"Innamal a'malu binniyyat..."
Arabic + Urdu text

Grade: Sahih ✅
Source: [sunnah.com/bukhari:52 ↗]
Narrator: Umar ibn al-Khattab (RA)
```

---

### Database Schema — Reference Fields

**Every content table has `ref_url` field:**

```sql
-- ayahs table
ALTER TABLE ayahs ADD COLUMN
  ref_url VARCHAR(500) 
  GENERATED ALWAYS AS (
    CONCAT('https://quran.com/', surah_id, ':', ayah_number)
  ) STORED;
-- Auto-generated. Always accurate. Never null.

-- tafsir_entries table
ALTER TABLE tafsir_entries ADD COLUMN
  ref_url VARCHAR(500);
-- Ibn Kathir ayah 2:153:
-- https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/
--   tafsir/ar-tafsir-ibn-kathir/2/153.json

-- hadiths table
ALTER TABLE hadiths ADD COLUMN
  ref_url VARCHAR(500);
-- Generated as:
-- https://sunnah.com/{collection_slug}:{hadith_number}
-- e.g. https://sunnah.com/bukhari:52

-- sabab_nuzool table
ALTER TABLE sabab_nuzool ADD COLUMN
  ref_url VARCHAR(500);
-- Points to ayah on quran.com
-- + Al-Wahidi source book reference
```

---

### Reference Display Component (UI Rule)

**Every piece of Islamic content in Al-Huda — ayah, hadith, tafsir — must show:**

```
┌─────────────────────────────────────────────┐
│  إِنَّ اللَّهَ مَعَ الصَّابِرِينَ          │
│  "Beshak Allah sabrr karne walon ke saath"  │
│                                             │
│  📖 Al-Baqarah 2:153                        │
│  🔗 quran.com/2:153                          │
│  📚 Tafsir: Ibn Kathir | Al-Sa'di           │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  "Innamal a'malu binniyyat..."              │
│  "Aamaal ka daro-madar niyyat par hai"      │
│                                             │
│  📗 Sahih al-Bukhari — Hadith 1             │
│  ✅ Grade: Sahih                            │
│  🔗 sunnah.com/bukhari:1                    │
└─────────────────────────────────────────────┘
```

**Non-negotiable rule:** No Islamic content displayed without visible, tappable reference link. User can verify every single claim in 1 tap.

---

### Story Generator — Reference Requirement

Personalized stories (Feature N-08) also include references:

```
"...Allah ne farmaya:

 إِنَّ اللَّهَ مَعَ الصَّابِرِينَ

 'Beshak Allah sabrr karne walon ke saath hai'
 — Al-Baqarah 2:153

 [Verify: quran.com/2:153 ↗]
 [Tafsir: Ibn Kathir ↗]"
```

Even in a children's story — every ayah citable.

---

## 06.4 What AI Will NEVER Generate

```
❌ Tafsir — explanation of ayah meaning
❌ Fatwa — Islamic ruling
❌ Hadith — prophetic narration
❌ Aqeedah — creedal positions
❌ Fiqh — jurisprudential positions
❌ Any claim about what Islam "says"
   without a verified source citation

✅ AI ONLY does:
→ Retrieve from verified database
→ Simplify existing verified text
→ Translate already-translated content
→ Connect nodes in knowledge graph
→ Personalize presentation (not content)
```

---

# SECTION 07 — AI/ML LAYER

## 07.0 Complete Stack Overview — All Free

```
┌─────────────────────────────────────────────────────────┐
│                    AL-HUDA AI STACK                     │
│                   Total Extra Cost: $0                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  PROVIDER LAYER (LiteLLM Gateway)                      │
│  100+ providers — OpenAI, Anthropic, Gemini,           │
│  GLM, DeepSeek, Ollama, Azure, Groq, etc.             │
│  github.com/BerriAI/litellm — MIT License              │
│                                                         │
│  PHASE 1 — GRAPH BUILD (One-time, offline)             │
│  Graphify (MIT) → Quran data → Knowledge graph         │
│  github.com/safishamsi/graphify                        │
│  Ollama local → Embeddings → pgvector                  │
│  GLM (existing) → Theme classification                 │
│                                                         │
│  PHASE 2 — CONTENT GENERATION (One-time)               │
│  NotebookLM (free) → Authentic tafsir summaries        │
│  spa5k/tafsir_api → Per-ayah tafsir (free CDN)        │
│                                                         │
│  PHASE 3 — RUNTIME (Per user request)                  │
│  Graphiti (MIT) → Living user graph                    │
│  github.com/getzep/graphiti                            │
│  pgvector → Semantic search                            │
│  LiteLLM → Any provider user configures               │
│                                                         │
│  PHASE 4 — PERSONALIZED STORIES (NOOR)                 │
│  Parent input → Situation → Relevant ayaat →           │
│  Scholar-approved template → LiteLLM generate →        │
│  Authenticated story output                            │
└─────────────────────────────────────────────────────────┘
```

---

## 07.1 Architecture Overview

```
USER QUERY
    ↓
QUERY CLASSIFIER
    ↓
┌────────────────┬─────────────────┬──────────────────┐
│ GRAPH TRAVERSAL│  RAG RETRIEVAL  │  PERSONALIZATION │
│ (Graphiti)     │  (pgvector)     │  ENGINE          │
│                │                 │                  │
│ User's living  │ Authenticated   │ User context     │
│ context graph  │ tafsir chunks   │ profile          │
└───────┬────────┴────────┬────────┴──────────────────┘
        └────────┬─────────┘
                 ↓
         RESPONSE GENERATOR
         (GLM — existing)
         Strict: "Only use provided nodes.
                  Cite source. Do not add."
                 ↓
         SCHOLAR VALIDATION LAYER
         (new content types only)
                 ↓
         USER RESPONSE
         (Source always shown)
```

---

## 07.2 Graphify — Knowledge Graph Build (Phase 1)

**Repo:** `safishamsi/graphify` — MIT License — Free
**Purpose:** One-time run — turn all Quran data into a queryable knowledge graph automatically.

**What Graphify does:**
- Takes folder of text files (ayaat + tafsir + hadith)
- Tree-sitter static analysis + LLM semantic extraction
- Leiden community detection — auto-clusters related content
- No embeddings needed — graph topology IS the similarity signal
- Exports to `graph.json` + Neo4j directly
- **71.5x fewer tokens** per query vs naive RAG

**Al-Huda One-Time Build:**
```bash
# Install
pip install graphifyy && graphify install

# Point at Quran data folder
/graphify ./quran-data --neo4j-push bolt://localhost:7687

# Input folder contains:
# - ayaat.json (6,236 ayaat + translations)
# - tafsir_saddi.json
# - tafsir_muyassar.json  
# - tafsir_ibn_kathir.json (from spa5k API)
# - hadiths.json (50,884 hadiths)
# - root_words.json

# Graphify automatically:
# → Extracts nodes (ayah, theme, root, hadith)
# → Finds EXTRACTED connections (same root word)
# → Infers INFERRED connections (semantic similarity)
# → Leiden clustering → "Sabr cluster", "Rizq cluster" etc.
# → Pushes to Neo4j

# Time: ~2-3 hours on Hetzner VPS
# Cost: $0
```

**Edge confidence tags (Graphify standard):**

| Tag | Meaning | Trust Level |
|---|---|---|
| `EXTRACTED` | Directly in source — same root word, same named prophet | ✅ Auto-approve |
| `INFERRED` | Semantic reasoning — similar theme, related concept | ⚠️ Scholar review |
| `AMBIGUOUS` | Uncertain — flagged | ❌ Scholar decide |

**Result:** Living Neo4j graph — themes auto-clustered — connections confidence-tagged — scholar reviews only INFERRED + AMBIGUOUS.

---

## 07.3 Graphiti — Living User Graph (Phase 2)

**Repo:** `getzep/graphiti` — MIT License — Free
**Purpose:** Every user's personal Quran journey becomes a temporal knowledge graph.

**What Graphiti adds over static graph:**
- Tracks how user's relationship with Quran changes over time
- "You saved this ayah 3 times — always in difficult moments"
- Facts have validity windows — temporal awareness
- Connects user journal entries to ayaat to life events
- Every fact traces back to source episode (raw user action)

**Integration:**
```python
from graphiti_core import Graphiti

g = Graphiti(neo4j_uri, neo4j_user, neo4j_pass)

# When user saves ayah with life context
await g.add_episode(
    name="user_journal_entry",
    episode_body=f"User {user_id} saved ayah 2:153 during 
                   business stress on {date}",
    reference_time=datetime.now(),
    source_description="Al-Huda personal journal"
)

# Graphiti automatically:
# → Creates temporal node for this event
# → Connects to ayah 2:153 node
# → Connects to "business_stress" context
# → Links to user's history
# → "Pattern detected: you turn to Sabr ayaat when stressed"
```

**Supports:** Neo4j (same instance as Graphify graph) + Gemini free tier for LLM.

---

## 07.4 NotebookLM Pipeline (Content Generation)

**Purpose:** Generate authenticated simplified tafsir summaries — one time.

```
STEP 1: Upload to NotebookLM (free)
→ Ibn Kathir Urdu PDF
→ Al-Sa'di Arabic text  
→ Al-Wahidi Asbab al-Nuzool
→ Relevant hadith collections

STEP 2: Query per ayah template
"Based ONLY on provided documents —
 simple Urdu meaning of [ayah]?
 Cite exact source location."

STEP 3: Output stored
{
  ayah_id: "2:153",
  simple_meaning: "...",
  source: "Tafsir Muyassar",
  scholar_approved: false
}

STEP 4: Scholar review → Approve → Production
Cost: $0
```

**Also:** `spa5k/tafsir_api` CDN provides per-ayah Ibn Kathir, Tabari, Muyassar — no processing needed. Direct import.

---

## 07.5 Free Embeddings — Ollama Local

**Purpose:** Semantic similarity for pgvector RAG queries.

```bash
# On Hetzner VPS (already running)
ollama pull nomic-embed-text
# MTEB score: 95.2 — beats OpenAI ada-002 (93.1)
# Cost: $0 — runs on existing VPS
```

**One-time embedding generation:**
```python
import ollama

for ayah in all_6236_ayaat:
    text = f"{ayah.arabic} {ayah.urdu} {ayah.tafsir_saddi}"
    embedding = ollama.embed(
        model="nomic-embed-text",
        input=text
    )
    pgvector.store(ayah.id, embedding.embeddings[0])

# Time: ~1 hour on Hetzner VPS
# Cost: $0
```

---

## 07.5a Provider-Agnostic Architecture — LiteLLM

**Repo:** `BerriAI/litellm` — MIT License — Free
**Ref:** github.com/BerriAI/litellm | docs.litellm.ai
**Purpose:** Single unified gateway for 100+ AI providers. No provider lock-in. User brings their own key or uses Al-Huda default.

**Why LiteLLM:**
- Open source AI Gateway — single unified interface to call 100+ LLM providers using OpenAI format
- MIT-licensed, self-hosted — organizations only pay for infrastructure. 100+ LLM integrations, budgets, rate limits, logging, and virtual keys all in free edition
- Supports Anthropic, AWS Bedrock, Azure OpenAI, DeepSeek, Google Vertex AI, OpenAI, and Ollama

**Al-Huda Provider Matrix:**

| Region | Recommended Provider | Why |
|---|---|---|
| Pakistan | GLM-4-Flash (ZhipuAI) | Cheapest — already in BrainSync |
| Middle East | Gemini Flash (Google) | Free tier generous |
| Enterprise | Azure OpenAI / Ollama local | Data privacy |
| Scholar | Ollama (local) | No data leaves device |
| BYOK user | Any — user's own key | Full control |

**Three Tiers:**

```
TIER 1 — Al-Huda Default (no key needed)
→ GLM-4-Flash backend
→ Free tier for basic queries
→ Pro tier for unlimited

TIER 2 — BYOK (Bring Your Own Key)
→ User pastes their API key in settings
→ OpenAI / Anthropic / Gemini / etc.
→ Cost goes to user's account directly
→ Al-Huda takes no cut

TIER 3 — Local (Scholar / Privacy)
→ Ollama running on user's machine
→ Zero data leaves device
→ Scholar institutions use this
```

**NestJS Integration:**

```typescript
// Al-Huda NestJS — LiteLLM proxy
// Single endpoint — provider swappable at runtime

import { LiteLLM } from 'litellm';

const client = new LiteLLM({
  apiBase: process.env.LITELLM_PROXY_URL, // self-hosted on Hetzner
});

async function getGuidance(query: string, userProvider: string) {
  const response = await client.completion({
    model: userProvider || 'glm-4-flash', // fallback to GLM
    messages: [
      { role: 'system', content: ISLAMIC_GUIDANCE_SYSTEM_PROMPT },
      { role: 'user', content: query }
    ],
    // Strict: only use provided authenticated context
  });
  return response.choices[0].message.content;
}

// Provider stored in user settings:
// user.preferred_provider = "gpt-4o" | "gemini-flash" | "glm-4-flash" | "ollama/llama3"
```

**LiteLLM self-hosted on Hetzner (same VPS):**
```bash
# docker-compose.yml addition
litellm:
  image: ghcr.io/berriai/litellm:main-stable
  ports:
    - "4000:4000"
  environment:
    - LITELLM_MASTER_KEY=${LITELLM_KEY}
  # Manages all provider routing
  # Cost tracking built-in
  # Fallback: if GLM fails → Gemini Flash
```

**Cost:** LiteLLM proxy = $0 (MIT). Only pay for actual LLM tokens used.

---

## 07.5b Personalized Story Generator — NOOR Mode

**Purpose:** Parent describes child's situation → App generates authenticated Quranic story personalized to that exact child and situation.

**The Core Idea:**
```
Fixed stories = good
Personalized stories = transformational

Child heard "don't lie" a hundred times.
Child never heard:
"Hania — tumhari tarah ek bacha tha —
 usne bhi yahi kiya — aur Quran ne kaha..."

That lands differently.
```

**Authentic Safety Layer — Critical:**
```
AI NEVER generates:
❌ New Islamic rulings
❌ Fabricated Quranic references
❌ Made-up hadith
❌ Scholar opinions

AI ONLY does:
✅ Fills scholar-approved story TEMPLATE
✅ Injects child name + situation
✅ Uses PRE-VERIFIED authentic ayaat
✅ Keeps narrative around verified content
```

**Scholar-Approved Templates:**

Each moral situation has a pre-built template — reviewed and approved by advisory scholars — with:
- Verified ayah(s) for this moral lesson
- Authentic hadith (sahih/hasan only) if applicable
- Story structure (problem → Quranic reference → resolution)
- AI fills: child name, age-appropriate language, specific details

**Situation → Ayah Mapping (sample):**

| Situation | Primary Ayah | Source | Scholar Approved |
|---|---|---|---|
| Jhooth bolna (lying) | Al-Tawbah 9:119 | Ibn Kathir | ✅ |
| Ghussa (anger) | Aal-e-Imran 3:134 | Al-Sa'di | ✅ |
| Bhai/bahen se jhagda | Al-Hujurat 49:10 | Tafsir Muyassar | ✅ |
| Cheez chori karna | Al-Ma'idah 5:38 context | Ibn Kathir | ✅ |
| Dost se zulm | An-Nisa 4:135 | Al-Sa'di | ✅ |
| Namaz nahi parhna | Al-Baqarah 2:45 | Muyassar | ✅ |
| Waalidain ki nafarmani | Al-Isra 17:23 | Ibn Kathir | ✅ |
| Hasad (jealousy) | Yusuf story — 12:8-9 | Al-Sa'di | ✅ |
| Khana waste karna | Al-A'raf 7:31 | Muyassar | ✅ |
| Bully karna | Al-Hujurat 49:11 | Ibn Kathir | ✅ |

**Technical Flow:**

```
STEP 1 — Parent Input
━━━━━━━━━━━━━━━━━━━━
{
  child_name: "Hania",
  child_age: 7,
  child_gender: "beti",
  situation: "usne apni dost se jhooth bola",
  moral_lesson: "honesty", // auto-detected OR parent selects
  language: "urdu"
}

STEP 2 — Authentic Content Retrieval
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
moral_lesson → lookup situations table
→ Get: ayah_id, tafsir snippet, hadith_id (if any)
→ All pre-verified, scholar-approved

STEP 3 — Template Selection
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Select scholar-approved story template for "honesty"
Template contains:
[CHILD_NAME], [AGE_REF], [SITUATION_DETAIL],
[AYAH_ARABIC], [AYAH_URDU], [MORAL_CONCLUSION]

STEP 4 — LiteLLM Generation
━━━━━━━━━━━━━━━━━━━━━━━━━━━
System prompt (strict):
"You are generating a children's Islamic story.
 Use ONLY the provided template and authentic content.
 Fill in [CHILD_NAME] with Hania.
 Keep language age-appropriate for 7-year-old.
 Do NOT add any Islamic content not in the template.
 Do NOT fabricate any Quranic references.
 The ayah provided is authentic — use it exactly as given.
 Story should be warm, loving, non-scary."

Input:
- Template
- Verified ayah: [Arabic] [Urdu meaning]
- Child details
- Situation

Output:
Personalized story — 300-400 words — Urdu
With Hania's name, her exact situation,
authentic ayah embedded naturally,
warm resolution

STEP 5 — Post-Generation Safety Check
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Auto-check: Does output contain ayah exactly as provided? ✅
Auto-check: No extra Quranic references added? ✅
Auto-check: No hadith not in template? ✅
Flag for review if any check fails

STEP 6 — Delivered to Child
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Dadi Jan voice reads it
Hania's name throughout
Her exact situation mirrored
Quran's authentic answer
```

**Sample Output (abbreviated):**

```
"Hania beta — suno ek pyaari kahani —

Ek baar ek 7 saal ki bachi thi —
bilkul tumhari tarah —
uska naam Noor tha —
aur uski bhi ek bht achhi dost thi, Sara.

Ek din Noor ne Sara se kaha:
'Main sick thi — isliye school nahi aayi'
Lekin yeh sach nahi tha...

Raat ko Noor so nahi payi.
Dil mein kuch tha jo chain nahi deta tha.

Allah ne Quran mein farmaya:

يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ
وَكُونُوا مَعَ الصَّادِقِينَ

'Aye imaan waalo — Allah se daro —
 aur sachon ke saath raho'
— At-Tawbah 9:119
(Ibn Kathir ke mutabiq yeh ayah sachon
 ka saath rehne ka hukm deti hai)

Noor uth gayi — ammi ke paas gayi —
sab kuch bataya —
ammi ne pyaar se kaha:
'Chalo Sara ko phone karo — maafi maango'

Sara ne maaf kiya —
aur dosti aur mazboot ho gayi ❤️

Hania — kya tum bhi itni brave ho? 🌙"
```

**Parent Dashboard — After Story:**
```
"Aaj Hania ke liye story generate hui:
 Moral: Sachai (Honesty)
 Ayah used: At-Tawbah 9:119 (authenticated ✅)
 Source: Ibn Kathir (scholar approved ✅)

 Ghar mein poochho:
 'Hania — Noor ne kya kiya tha?
  Tum bhi kar sakti ho?'"
```

**Story Library — Grows Over Time:**
```
Generated stories save hoti hain:
- Child ke profile mein
- Parent dekh sakta hai
- "Hania ki stories" — personal library
- Same moral — different story — fresh experience
- Patterns track: "Hania ko anger management
  3 baar address hua — progress dekho"
```

**Cost per story generation:**
```
GLM-4-Flash: ~$0.001 per story (< 1 paisa)
Gemini Flash: ~$0.0005 per story
10 stories/month/child: < $0.01 total
Practically free.
```

**Purpose:** Auto-tag every ayah across 10 dimensions.

```python
# Using GLM — already in BrainSync stack
for ayah in all_6236_ayaat:
    response = glm.chat(
        prompt=f"""
        Ayah: {ayah.urdu}
        Tafsir: {ayah.tafsir_saddi}
        
        In mein se konse 3 dimensions apply hote hain?
        [Spiritual, Personal, Family, Social, Economic,
         Intellectual, Governance, Jihad, Interfaith, Ilm]
        
        Sirf JSON return karo:
        {{"themes": ["X", "Y"], "confidence": 0.85}}
        """,
        model="glm-4-flash"
    )
    db.store_themes(ayah.id, response.themes)

# Cost: GLM already paid for (BrainSync)
# 6,236 ayaat × GLM Flash = ~$0.50 one time
```

---

## 07.7 RAG Pipeline — Runtime Queries

**Purpose:** "Quran se poochho" — real-time guidance.

```
User query: "Mere business mein dhoka hua"
    ↓
1. Query embedded (Ollama — $0)
    ↓
2. pgvector similarity search
   → Top 5 relevant ayah chunks
    ↓
3. Graphiti traversal
   → User's personal context nodes
   → Previous relevant ayaat
    ↓
4. GLM Flash prompt:
   "Only use provided authenticated text.
    Cite source. Do not generate."
    ↓
5. Response with:
   - Arabic ayah
   - Urdu meaning
   - Ibn Kathir context (cited)
   - Personalized connection
   - "Specific masail: alim se milein"
```

---

## 07.8 Scholar Validation Layer

```
All AI outputs tagged:

AUTO-APPROVED:
✅ EXTRACTED connections (Graphify)
✅ Root word connections (deterministic)
✅ spa5k tafsir API content (scholar-sourced)

SCHOLAR REVIEW QUEUE:
⚠️ INFERRED connections (Graphify)
⚠️ Theme classifications (GLM)
⚠️ Ayah-hadith connections

NEVER PUBLISHED WITHOUT SCHOLAR:
❌ AMBIGUOUS connections
❌ Any new Islamic content claim
❌ Anything not in authenticated sources
```

---

## 07.9 Personalization Engine

Rule-based (Phase 1 — no ML needed):

```
User profile → Rules engine:

profession = "business_owner"
→ ADD business_lens to Economic ayaat

current_situation includes "stress"
→ PRIORITIZE Spiritual + Personal dimensions

arabic_level = "beginner"
→ SHOW Urdu meaning only
→ HIDE grammar notes

Graphiti history shows "saves Sabr ayaat often"
→ SUGGEST: "Explore Sabr knowledge cluster"
```

**Phase 2:** ML personalization from interaction data.

---

## 07.10 Arabic Learning Engine

```
Root word curriculum sequencing:

ORDER by:
1. Quran frequency (highest first — from mustafa0x data)
2. Simplicity
3. Already seen in story context

Spaced repetition (Ebbinghaus):
Mastered → review day 7
Struggling → review tomorrow
New → story context first

Per user tracking in MySQL:
root_learning table (user_id, root_id, status, next_review)
```

---

## 07.11 Complete Cost Summary

| Component | Tool | Ref | Cost |
|---|---|---|---|
| Knowledge graph build | Graphify (MIT) | github.com/safishamsi/graphify | $0 |
| Living user graph | Graphiti (MIT) | github.com/getzep/graphiti | $0 |
| Provider gateway | LiteLLM (MIT) | github.com/BerriAI/litellm | $0 |
| Embeddings | Ollama local (Hetzner) | ollama.com | $0 |
| Theme classification | GLM Flash (one-time ~$0.50) | zhipuai.cn | ~$0.50 |
| Tafsir content | NotebookLM + spa5k CDN | notebooklm.google.com / github.com/spa5k/tafsir_api | $0 |
| Vector DB | pgvector (Postgres) | github.com/pgvector/pgvector | $0 |
| Graph DB | Neo4j free tier | neo4j.com | $0 |
| Runtime LLM | GLM / user's provider via LiteLLM | Existing | Existing |
| Personalized stories | LiteLLM + templates | ~$0.001/story | ~$0 |
| **TOTAL** | | | **~$0.50 one-time** |
# AL-HUDA PRD — PART 2
## Sections 08-20

---

# SECTION 08 — TECHNICAL STACK

## 08.1 Stack Overview

```
┌─────────────────────────────────────────────────────┐
│                   FRONTEND                          │
│                                                     │
│  Next.js 14 (Web)          Flutter 3.x (Mobile)    │
│  → App Router              → Android (Phase 1)     │
│  → SSR for SEO             → iOS (Phase 2)         │
│  → React Server Components → Offline first         │
│  → Tailwind CSS            → SQLite local          │
└─────────────────┬───────────────────────────────────┘
                  │ REST API + WebSocket
┌─────────────────▼───────────────────────────────────┐
│                   BACKEND                           │
│                                                     │
│  NestJS 11                                          │
│  → Modular architecture                             │
│  → JWT Authentication                               │
│  → Rate limiting                                    │
│  → BullMQ job queues                                │
│  → Redis caching                                    │
└──────┬──────────┬──────────┬──────────┬─────────────┘
       │          │          │          │
┌──────▼──┐ ┌────▼────┐ ┌───▼───┐ ┌───▼──────────┐
│  MySQL  │ │ pgvector│ │ Neo4j │ │    Redis     │
│ (main)  │ │(vectors)│ │(graph)│ │   (cache)    │
└─────────┘ └─────────┘ └───────┘ └──────────────┘
       │
┌──────▼────────────────────────────────────────────┐
│                 AI LAYER                          │
│                                                   │
│  NotebookLM (content gen)                        │
│  Gemini Flash API (RAG responses)                │
│  text-embedding-004 (vectors)                    │
└───────────────────────────────────────────────────┘
       │
┌──────▼────────────────────────────────────────────┐
│               INFRASTRUCTURE                      │
│                                                   │
│  Coolify (self-hosted PaaS)                      │
│  Hetzner VPS (161.97.156.98)                     │
│  Cloudflare (CDN + DNS + DDoS)                   │
└───────────────────────────────────────────────────┘
```

## 08.2 Technology Decisions

### Why Next.js (not plain React)

| Reason | Detail |
|---|---|
| SEO | Every ayah gets its own indexed page — organic traffic |
| SSR | First page load fast — important for global users |
| App Router | Server components = less JS = faster |
| Image optimization | Arabic text rendering + illustrations |
| Built-in API routes | Prototypes fast |

### Why Flutter (not React Native)

| Reason | Detail |
|---|---|
| Already in stack | Dawood knows Flutter |
| Performance | Native rendering — important for Arabic text |
| Offline-first | SQLite built-in — Quran works without internet |
| Single codebase | Android + iOS |
| Platform channels | Audio recitation integration |

### Why NestJS

Already used in BrainSync, MyDukan. Team knows it. Modular. TypeScript. Perfect for this scale.

### Why Neo4j

Knowledge graph is the core feature. MySQL cannot efficiently traverse multi-hop graph queries like:
"Find all ayaat connected to sabr → that also relate to business → and have a relevant hadith"

Neo4j handles this natively with Cypher query language.

### Why pgvector (not Pinecone/Weaviate)

Already using Postgres. pgvector is a free extension. No separate service. No extra cost. For 6,236 ayaat + tafsir chunks — pgvector is more than sufficient.

## 08.3 Mobile Offline Architecture

```
Flutter app downloads on install:
- Complete Arabic Quran (tanzil.net data)
- Urdu translation (Jalandhari)
- Basic tafsir summaries (Muyassar)
- Root word dictionary (500 roots)
- Stories audio (compressed)

All stored in SQLite (encrypted)

Online fetches:
- Knowledge graph queries
- Personalized guidance (RAG)
- Sync journal entries
- Stream audio recitations
- New content updates
```

## 08.4 Arabic Text Rendering

**Critical requirement:** Arabic text must render correctly with full tashkeel (diacritics) on all platforms.

**Web (Next.js):**
- Font: Amiri or KFGQPC Uthman Taha Naskh (both free)
- RTL direction: `dir="rtl"` on Arabic containers
- Font size: Minimum 1.4rem for readability

**Flutter:**
- Use `flutter_arabic_text` package or custom rendering
- Google Fonts: Amiri available
- RTL text direction built into Flutter

## 08.5 Audio Architecture

**Recitation sources (free, open):**
- Mishary Rashid Alafasy — everyayah.com API
- Abdul Basit — archive.org (public domain)
- Hussein Al-Jasmi

**Flutter audio:**
- `just_audio` package
- Stream from CDN
- Cache most-used surahs locally

---

# SECTION 09 — DATABASE SCHEMA

## 09.1 MySQL — Main Database

```sql
-- ════════════════════════════════════
-- CORE QURAN DATA
-- ════════════════════════════════════

CREATE TABLE surahs (
  id              INT PRIMARY KEY,        -- 1-114
  name_arabic     VARCHAR(100) NOT NULL,  -- الفاتحة
  name_urdu       VARCHAR(100),           -- الفاتحہ
  transliteration VARCHAR(100),           -- Al-Fatiha
  meaning_urdu    VARCHAR(200),           -- افتتاح
  meaning_en      VARCHAR(200),           -- The Opening
  revelation_type ENUM('meccan','medinan'),
  total_verses    INT,
  juz_start       INT,
  order_revealed  INT,                    -- Chronological order
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ayahs (
  id              INT PRIMARY KEY AUTO_INCREMENT,
  surah_id        INT REFERENCES surahs(id),
  ayah_number     INT NOT NULL,
  arabic_text     TEXT NOT NULL,          -- Full tashkeel
  arabic_clean    TEXT,                   -- Without tashkeel
  juz             INT,
  page            INT,
  rub             INT,                    -- Quarter division
  hizb            INT,
  sajda           BOOLEAN DEFAULT FALSE,
  global_index    INT UNIQUE,             -- 1-6236
  ref_url         VARCHAR(500) GENERATED ALWAYS AS (
                    CONCAT('https://quran.com/', surah_id, ':', ayah_number)
                  ) STORED,              -- e.g. https://quran.com/2:255
  created_at      TIMESTAMP DEFAULT NOW(),
  INDEX idx_surah_ayah (surah_id, ayah_number)
);

-- ════════════════════════════════════
-- TRANSLATIONS & TAFSIR
-- ════════════════════════════════════

CREATE TABLE translations (
  id              INT PRIMARY KEY AUTO_INCREMENT,
  ayah_id         INT REFERENCES ayahs(id),
  language        VARCHAR(10),            -- ur, en, fr
  translator      VARCHAR(100),           -- Jalandhari
  translation     TEXT NOT NULL,
  source_verified BOOLEAN DEFAULT FALSE,
  scholar_approved BOOLEAN DEFAULT FALSE,
  INDEX idx_ayah_lang (ayah_id, language)
);

CREATE TABLE tafsir_entries (
  id              INT PRIMARY KEY AUTO_INCREMENT,
  ayah_id         INT REFERENCES ayahs(id),
  scholar         VARCHAR(100),           -- Ibn Kathir
  work_name       VARCHAR(200),           -- Tafsir al-Quran al-Azeem
  language        VARCHAR(10),
  level           ENUM('simple','intermediate','deep','classical'),
  content         TEXT NOT NULL,
  content_urdu    TEXT,
  source_ref      VARCHAR(200),           -- "Vol 1, p. 45"
  ref_url         VARCHAR(500),           -- spa5k CDN URL e.g.
                                          -- https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir/ar-tafsir-ibn-kathir/{surah}/{ayah}.json
  scholar_approved BOOLEAN DEFAULT FALSE,
  approved_by     VARCHAR(100),
  approved_at     TIMESTAMP,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sabab_nuzool (
  id              INT PRIMARY KEY AUTO_INCREMENT,
  ayah_id         INT REFERENCES ayahs(id),
  surah_id        INT REFERENCES surahs(id),
  context_start   INT,                    -- If covers range
  context_end     INT,
  narrative_urdu  TEXT NOT NULL,
  narrative_en    TEXT,
  source          VARCHAR(200),           -- Al-Wahidi
  hadith_ref      VARCHAR(200),
  scholar_approved BOOLEAN DEFAULT FALSE
);

-- ════════════════════════════════════
-- ARABIC LEARNING
-- ════════════════════════════════════

CREATE TABLE root_words (
  id              INT PRIMARY KEY AUTO_INCREMENT,
  root_arabic     VARCHAR(20) NOT NULL,   -- ص-ب-ر
  root_meaning_ur VARCHAR(200),           -- صبر کرنا
  root_meaning_en VARCHAR(200),           -- To be patient
  quran_frequency INT,                    -- Times in Quran
  difficulty_level INT DEFAULT 1,         -- 1-5
  first_appearance_ayah INT REFERENCES ayahs(id)
);

CREATE TABLE root_derivatives (
  id              INT PRIMARY KEY AUTO_INCREMENT,
  root_id         INT REFERENCES root_words(id),
  word_arabic     VARCHAR(50),            -- صَبَرَ
  word_form       VARCHAR(100),           -- Past tense
  meaning_ur      VARCHAR(200),           -- اس نے صبر کیا
  meaning_en      VARCHAR(200),           -- He was patient
  quran_frequency INT
);

CREATE TABLE ayah_roots (
  ayah_id         INT REFERENCES ayahs(id),
  root_id         INT REFERENCES root_words(id),
  word_position   INT,                    -- Position in ayah
  word_arabic     VARCHAR(50),
  PRIMARY KEY (ayah_id, root_id, word_position)
);

-- ════════════════════════════════════
-- DIMENSIONS & THEMES
-- ════════════════════════════════════

CREATE TABLE dimensions (
  id              INT PRIMARY KEY AUTO_INCREMENT,
  name_urdu       VARCHAR(100),
  name_en         VARCHAR(100),
  name_arabic     VARCHAR(100),
  description_ur  TEXT,
  icon            VARCHAR(50)
);

CREATE TABLE themes (
  id              INT PRIMARY KEY AUTO_INCREMENT,
  dimension_id    INT REFERENCES dimensions(id),
  name_urdu       VARCHAR(200),
  name_en         VARCHAR(200),
  name_arabic     VARCHAR(200),
  description_ur  TEXT,
  total_ayaat     INT
);

CREATE TABLE ayah_themes (
  ayah_id         INT REFERENCES ayahs(id),
  theme_id        INT REFERENCES themes(id),
  relevance_score FLOAT DEFAULT 1.0,      -- 0-1
  added_by        ENUM('system','scholar','community'),
  scholar_approved BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (ayah_id, theme_id)
);

-- ════════════════════════════════════
-- STORIES (NOOR MODE)
-- ════════════════════════════════════

CREATE TABLE stories (
  id              INT PRIMARY KEY AUTO_INCREMENT,
  prophet_name_ur VARCHAR(100),
  prophet_name_ar VARCHAR(100),
  title_ur        VARCHAR(200),
  total_episodes  INT,
  age_range       VARCHAR(20),            -- 3-12
  difficulty      INT DEFAULT 1,
  main_lesson_ur  TEXT,
  primary_theme   INT REFERENCES themes(id)
);

CREATE TABLE story_episodes (
  id              INT PRIMARY KEY AUTO_INCREMENT,
  story_id        INT REFERENCES stories(id),
  episode_number  INT,
  title_ur        VARCHAR(200),
  content_ur      TEXT NOT NULL,          -- Full story text
  duration_seconds INT,
  root_words_featured JSON,              -- [root_id, ...]
  ayaat_featured  JSON,                  -- [ayah_id, ...]
  audio_url       VARCHAR(500),
  illustration_url VARCHAR(500)
);

-- ════════════════════════════════════
-- HADITH
-- ════════════════════════════════════

CREATE TABLE hadiths (
  id              INT PRIMARY KEY AUTO_INCREMENT,
  collection      VARCHAR(100),           -- Bukhari
  collection_slug VARCHAR(50),            -- bukhari, muslim, tirmidhi, abudawud, nasai, ibnmajah, malik
  book_number     INT,
  hadith_number   INT,
  arabic_text     TEXT,
  urdu_text       TEXT,
  english_text    TEXT,
  grade           ENUM('sahih','hasan','daif','fabricated'),
  chain           TEXT,
  narrator        VARCHAR(200),
  ref_url         VARCHAR(500)            -- https://sunnah.com/{collection_slug}:{hadith_number}
                                          -- e.g. https://sunnah.com/bukhari:1
                                          -- e.g. https://sunnah.com/muslim:2564
);

CREATE TABLE ayah_hadiths (
  ayah_id         INT REFERENCES ayahs(id),
  hadith_id       INT REFERENCES hadiths(id),
  connection_type ENUM('explains','context','example','ruling'),
  scholar_approved BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (ayah_id, hadith_id)
);

-- ════════════════════════════════════
-- USERS
-- ════════════════════════════════════

CREATE TABLE users (
  id              VARCHAR(36) PRIMARY KEY,  -- UUID
  phone           VARCHAR(20) UNIQUE,
  email           VARCHAR(255) UNIQUE,
  name            VARCHAR(200),
  mode            ENUM('noor','fahm','explore') DEFAULT 'fahm',
  language        VARCHAR(10) DEFAULT 'ur',
  arabic_level    ENUM('none','beginner','intermediate','advanced'),
  subscription    ENUM('free','pro','family') DEFAULT 'free',
  sub_expires_at  TIMESTAMP,
  created_at      TIMESTAMP DEFAULT NOW(),
  last_active     TIMESTAMP
);

CREATE TABLE user_profiles (
  user_id         VARCHAR(36) REFERENCES users(id),
  profession      VARCHAR(100),
  industry        VARCHAR(100),
  life_situations JSON,                   -- ["stress", "business"]
  goals           JSON,                   -- ["peace", "guidance"]
  depth_pref      ENUM('simple','intermediate','deep'),
  is_hafiz        BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (user_id)
);

CREATE TABLE family_accounts (
  id              INT PRIMARY KEY AUTO_INCREMENT,
  owner_user_id   VARCHAR(36) REFERENCES users(id),
  member_user_id  VARCHAR(36) REFERENCES users(id),
  relation        VARCHAR(50),            -- child, spouse
  child_age       INT
);

-- ════════════════════════════════════
-- USER PROGRESS & JOURNAL
-- ════════════════════════════════════

CREATE TABLE reading_progress (
  id              INT PRIMARY KEY AUTO_INCREMENT,
  user_id         VARCHAR(36) REFERENCES users(id),
  ayah_id         INT REFERENCES ayahs(id),
  read_at         TIMESTAMP DEFAULT NOW(),
  mode            VARCHAR(20),
  depth_level     VARCHAR(20),
  duration_seconds INT
);

CREATE TABLE personal_journal (
  id              INT PRIMARY KEY AUTO_INCREMENT,
  user_id         VARCHAR(36) REFERENCES users(id),
  ayah_id         INT REFERENCES ayahs(id),
  life_moment     TEXT,                   -- User's personal note
  emotion_tag     VARCHAR(50),
  private_note    TEXT,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE hifz_progress (
  id              INT PRIMARY KEY AUTO_INCREMENT,
  user_id         VARCHAR(36) REFERENCES users(id),
  ayah_id         INT REFERENCES ayahs(id),
  memorized       BOOLEAN DEFAULT FALSE,
  strength        INT DEFAULT 0,          -- 0-100
  last_reviewed   TIMESTAMP,
  next_review     TIMESTAMP,
  mistake_count   INT DEFAULT 0,
  mistake_positions JSON                  -- Word positions of mistakes
);

CREATE TABLE root_learning (
  user_id         VARCHAR(36) REFERENCES users(id),
  root_id         INT REFERENCES root_words(id),
  status          ENUM('new','seen','practiced','mastered'),
  seen_count      INT DEFAULT 0,
  last_seen       TIMESTAMP,
  next_review     TIMESTAMP,
  PRIMARY KEY (user_id, root_id)
);

-- ════════════════════════════════════
-- CONTENT MODERATION
-- ════════════════════════════════════

CREATE TABLE scholar_reviews (
  id              INT PRIMARY KEY AUTO_INCREMENT,
  content_type    VARCHAR(50),            -- tafsir_entry, theme_connection
  content_id      INT,
  scholar_name    VARCHAR(200),
  scholar_institution VARCHAR(200),
  status          ENUM('pending','approved','rejected','revision'),
  notes           TEXT,
  reviewed_at     TIMESTAMP
);

CREATE TABLE content_flags (
  id              INT PRIMARY KEY AUTO_INCREMENT,
  user_id         VARCHAR(36) REFERENCES users(id),
  content_type    VARCHAR(50),
  content_id      INT,
  reason          TEXT,
  status          ENUM('pending','reviewed','resolved'),
  created_at      TIMESTAMP DEFAULT NOW()
);
```

## 09.2 pgvector — Embeddings

```sql
-- Enable pgvector extension
CREATE EXTENSION vector;

CREATE TABLE content_embeddings (
  id              SERIAL PRIMARY KEY,
  content_type    VARCHAR(50),    -- ayah, tafsir, hadith, theme
  content_id      INT,
  language        VARCHAR(10),
  text_chunk      TEXT,
  embedding       vector(768),    -- text-embedding-004 dimensions
  metadata        JSONB,
  created_at      TIMESTAMP DEFAULT NOW()
);

-- IVFFlat index for fast similarity search
CREATE INDEX ON content_embeddings 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
```

## 09.3 Neo4j — Knowledge Graph Schema

```cypher
// Node definitions
CREATE CONSTRAINT ON (a:Ayah) ASSERT a.id IS UNIQUE;
CREATE CONSTRAINT ON (r:Root) ASSERT r.arabic IS UNIQUE;
CREATE CONSTRAINT ON (t:Theme) ASSERT t.id IS UNIQUE;
CREATE CONSTRAINT ON (s:Story) ASSERT s.id IS UNIQUE;
CREATE CONSTRAINT ON (d:Dimension) ASSERT d.id IS UNIQUE;
CREATE CONSTRAINT ON (h:Hadith) ASSERT h.id IS UNIQUE;

// Sample Cypher — Get knowledge web for an ayah
MATCH (a:Ayah {surah: 12, number: 4})
OPTIONAL MATCH (a)-[:HAS_ROOT]->(r:Root)
OPTIONAL MATCH (a)-[:BELONGS_TO_THEME]->(t:Theme)
OPTIONAL MATCH (a)-[:CONNECTED_TO]->(related:Ayah)
OPTIONAL MATCH (a)-[:PART_OF_STORY]->(s:Story)
OPTIONAL MATCH (a)-[:EXPLAINED_BY]->(h:Hadith)
RETURN a, r, t, related, s, h
LIMIT 50;
```

---

# SECTION 10 — API DESIGN

## 10.1 Base URL

```
Production: https://api.alhuda.app/v1
```

## 10.2 Authentication

```
POST /auth/request-otp      — Phone OTP
POST /auth/verify-otp       — Verify + JWT
POST /auth/google            — Google OAuth
POST /auth/refresh           — Refresh token
DELETE /auth/logout
```

## 10.3 Quran Endpoints

```
GET  /quran/surahs                      — All 114 surahs
GET  /quran/surahs/:id                  — Single surah metadata
GET  /quran/surahs/:id/ayaat            — All ayaat of surah
GET  /quran/ayah/:surah/:ayah           — Single ayah
     ?lang=ur&depth=intermediate
GET  /quran/ayah/:id/tafsir             — Tafsir for ayah
GET  /quran/ayah/:id/sabab-nuzool       — Context/occasion
GET  /quran/ayah/:id/connections        — Knowledge graph connections
GET  /quran/ayah/:id/breakdown          — Word-by-word
GET  /quran/search?q=&lang=             — Full text search
GET  /quran/juz/:number                 — All ayaat in juz
```

## 10.4 Personalization Endpoints

```
POST /personalize/setup                 — User profile setup
GET  /personalize/feed                  — Daily personalized feed
POST /personalize/guidance              — Guidance query (RAG)
     Body: { situation: "...", context: {} }
GET  /personalize/ayah/:id/lens         — Personalized lens for ayah
```

## 10.5 Learning Endpoints

```
GET  /learn/roots                       — Root word curriculum
GET  /learn/roots/:id                   — Single root word
GET  /learn/roots/daily                 — Today's root word
POST /learn/roots/:id/progress          — Mark progress
GET  /learn/hifz/schedule               — Today's review schedule
POST /learn/hifz/record                 — Record attempt result
GET  /learn/hifz/stats                  — Memorization stats
```

## 10.6 Knowledge Graph Endpoints

```
GET  /graph/ayah/:id                    — Graph web for ayah
GET  /graph/theme/:id                   — All ayaat in theme
GET  /graph/dimension/:id               — Full dimension explorer
GET  /graph/root/:id/ayaat              — All ayaat with root
GET  /graph/story/:id                   — Story + connected ayaat
POST /graph/explore                     — Custom graph query
     Body: { center: "ayah|theme|root", id: "", depth: 2 }
```

## 10.7 Stories Endpoints (NOOR)

```
GET  /stories                           — All stories list
GET  /stories/:id                       — Story metadata
GET  /stories/:id/episodes              — All episodes
GET  /stories/:id/episodes/:ep          — Single episode
POST /stories/:id/episodes/:ep/complete — Mark complete
GET  /stories/progress/:user_id         — Child progress
```

## 10.8 Journal Endpoints

```
GET  /journal                           — User's journal entries
POST /journal                           — Add entry
     Body: { ayah_id, life_moment, emotion_tag, note }
PUT  /journal/:id                       — Edit entry
DELETE /journal/:id                     — Delete entry
GET  /journal/stats                     — Personal stats
```

---

# SECTION 11 — USER FLOWS

## 11.1 New User Onboarding Flow

```
App Launch
    ↓
Splash Screen — "الهدى" with Bismillah
    ↓
"Aap kaun hain?" — 3 cards:
[🌙 Mera Bacha] [📖 Main Muslim Hoon] [🔍 Jaanna Chahta Hoon]
    ↓
Mode selected → Mode-specific onboarding
    ↓
── NOOR ──
Child name + age
Parent phone for dashboard
"Kaunsi kahani se shuru karein?"
→ Story list → Begin Episode 1

── FAHM ──
"Quran ke saath aapka rishta?"
[Hafiz] [Padhna aata hai] [Seekh raha hoon]
Arabic level assessment (3 simple ayaat)
Depth preference
Life context (profession + situation)
→ Home screen with personalized feed

── EXPLORE ──
"Aap ke baare mein thoda batayein"
Profession → Current interest → 
"Kya aap ne Quran ke baare mein kuch suna hai?"
→ Personalized discovery feed
```

## 11.2 Daily Use Flow — FAHM

```
Open app → Home screen
    ↓
"Aaj ka Quran" card:
Continuing from last position
    ↓
Flowing Tilawat Mode:
Arabic → Urdu meaning → Context → Aaj ke liye
    ↓
Ayah resonates? → Tap ❤️ → Journal entry
    ↓
Arabic word unfamiliar? → Tap word → Breakdown
    ↓
Want more depth? → Tap "Aur samjhein" → Ibn Kathir
    ↓
End of session → "Aaj aap ne X ayaat padhe"
Hifz reminder if scheduled
```

## 11.3 Guidance Flow

```
User taps "Quran se Poochhein"
    ↓
"Apni baat likkhein — koi bhi baat"
    ↓
User types situation
    ↓
Loading — "Quran mein dhundh rahe hain..."
    ↓
3-5 relevant ayaat shown:
Each with Arabic + Urdu + Context + Personalized note
    ↓
Knowledge graph: "Yeh ayah in se connected hai →"
    ↓
Bottom: "Specific masail ke liye alim se milein"
    ↓
Save any ayah to journal
```

## 11.4 Non-Muslim Discovery Flow

```
"Jaanna Chahta Hoon" mode selected
    ↓
Onboarding: profession + interest area
    ↓
Discovery Feed:
[Today's wisdom based on your profile]
    ↓
User reads — interested
    ↓
"Yeh kaahan se hai?" → Ayah reference shown
    ↓
"Aur jannein" → Sabab e Nuzool (context)
    ↓
"Isse connected →" → Knowledge graph
    ↓
Misconceptions section accessible always
    ↓
Save & share — clean card format
    ↓
NO prompt to convert. EVER.
```

---

# SECTION 12 — WEB (NEXT.JS)

## 12.1 Pages Structure

```
/ — Landing page
/discover — Non-Muslim entry point
/quran — Quran reader (web)
/quran/[surah] — e.g., /quran/al-fatiha
/quran/[surah]/[ayah] — e.g., /quran/al-baqarah/255
/explore — Knowledge graph explorer
/explore/dimension/[name] — e.g., /explore/dimension/economic
/explore/theme/[name] — e.g., /explore/theme/sabr
/explore/root/[root] — e.g., /explore/root/sabara
/stories — Noor stories (preview)
/app — Redirect to app download
/about — Mission
/scholars — Advisory board
```

## 12.2 SEO Strategy

**Every ayah = one indexed page.**

```
Page: /quran/al-baqarah/255 (Ayat al-Kursi)

Title: "Ayat al-Kursi — Al-Baqarah 2:255 — Quran with Urdu Translation"
Meta: "Complete understanding of Ayat al-Kursi with Arabic text, 
       Urdu translation, Ibn Kathir tafsir, and connected ayaat."

Structured data (JSON-LD): Quran verse schema
Open Graph: Arabic text + English meaning card
```

**Target keywords (organic):**
- "What does Quran say about [topic]" — English
- "Quran [topic] ke baare mein kya kehta hai" — Urdu
- "[Surah name] tafsir Urdu"
- "Islamic guidance [situation]"

**Estimated organic traffic potential:**
- "Quran on patience" — 5,400 searches/month
- "Quran about depression" — 2,900 searches/month
- "Islamic business ethics" — 1,600 searches/month
- Multiply by 6,236 pages = significant long-tail

## 12.3 Knowledge Graph Explorer (Web Feature)

```
Large screen — D3.js or Cytoscape.js visualization

Center: User selects any ayah, theme, or root
Graph renders with connected nodes
Node size = connection count
Colors = dimensions

Controls:
[Filter by dimension] [Filter by surah] [Depth: 1-3]
[Search] [Reset]

Tap node → Side panel shows:
Arabic + Translation + Tafsir snippet + Link to full page
+ Full ReferenceBar component (see Section 05.5.8)
```

## 12.4 ReferenceBar Component — Web

Every Islamic content piece on web renders `<ReferenceBar>` (Section 05.5.8).

**Additional web-only behaviour:**

```tsx
// Structured data for SEO — every ayah page
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Quotation",
  "text": "Beshak Allah sabrr karne walon ke saath hai",
  "inLanguage": "ur",
  "isPartOf": {
    "@type": "Book",
    "name": "Al-Quran",
    "author": "Allah (SWT)"
  },
  "citation": "https://quran.com/2:153"
}
</script>
```

Every reference link is a proper `<a href rel="noopener">` — Google indexes the citation chain — Al-Huda becomes a trusted Islamic reference source in search.

---

# SECTION 13 — MOBILE (FLUTTER)

## 13.1 App Structure

```
Bottom Navigation:
[🏠 Home] [📖 Quran] [🔍 Explore] [💡 Learn] [👤 Profile]

Home: Personalized feed + daily content
Quran: Tilawat + Fahm mode
Explore: Knowledge graph (simplified) + Dimensions
Learn: Root words + Hifz engine + Stories (Noor)
Profile: Journal + Progress + Settings
```

## 13.2 Offline-First Architecture

```
On install, download:
- quran.db (SQLite — Arabic + Urdu — ~15MB)
- roots.db (SQLite — 500 roots — ~2MB)
- stories_audio/ (compressed — ~50MB Phase 1)
- tafsir_basic.db (Muyassar summaries — ~10MB)

Total offline package: ~80MB (acceptable)

Online features:
- Knowledge graph queries
- RAG guidance
- New stories
- Sync
```

## 13.3 Home Screen Widget

```
Android widget:
Small: Today's ayah (Arabic + 1 line Urdu)
Medium: Arabic + Urdu + Root word of the day
Large: Arabic + Urdu + "Aaj ki baat" from guidance
```

## 13.4 Taraweeh Mode (Ramadan Special)

```
Special UI mode — activated in settings
Dark mode. Minimal. Distraction-free.

As imam recites:
- Ayah highlighted (auto or manual advance)
- Below: Urdu meaning
- No other UI elements

Font size: Large (accessibility)
Keep screen on: Always in this mode
```

## 13.5 ReferenceBar Widget — Flutter

Reusable widget — used on every screen that shows Islamic content. Full spec in Section 05.5.7.

**Three display modes:**

```dart
// 1. FULL MODE — tilawat, guidance screens
ReferenceBar(
  type: ReferenceType.ayah,
  surahNumber: 2, ayahNumber: 153,
  surahName: "Al-Baqarah",
  revelationType: "Madinah",
  juz: 2, page: 23,
  externalUrl: "https://quran.com/2:153",
  tafsirLinks: [...],
  compact: false,
)

// 2. COMPACT MODE — stories, cards, notifications
ReferenceBar(
  type: ReferenceType.ayah,
  surahNumber: 2, ayahNumber: 153,
  compact: true,
  // renders: "Al-Baqarah 2:153 • quran.com ↗"
)

// 3. HADITH MODE
ReferenceBar(
  type: ReferenceType.hadith,
  collection: "Sahih al-Bukhari",
  collectionSlug: "bukhari",
  hadithNumber: 1,
  grade: HadithGrade.sahih,
  narrator: "Umar ibn al-Khattab (RA)",
  externalUrl: "https://sunnah.com/bukhari:1",
  compact: false,
)
```

**Tap behaviour:**
```
Tap external URL → in-app WebView opens
                   OR system browser (user setting)
Tap tafsir link  → in-app WebView
Tap "Verify"     → full-screen reference modal
```

**Widget in Taraweeh Mode:**
```
Taraweeh mode = compact always
Reference bar shrinks to single line
Tap = expands
Does not disrupt tilawat flow
```

---

# SECTION 14 — MONETIZATION


## 14.1 Pricing Tiers

### Free Tier

| Feature | Limit |
|---|---|
| Quran reading (basic) | Full 114 surahs |
| Urdu translation | All ayaat |
| Basic tafsir (Muyassar) | All ayaat |
| Noor stories | 3 stories |
| Root words | 50 roots |
| Daily ayah | 1/day |
| Guidance queries | 5/month |
| Knowledge graph | 10 explorations/month |
| Journal entries | 10 |

**Why generous free tier:** Trust-first product. Islamic product cannot be paywalled heavily. Build habit → convert.

### Pro — PKR 1,500/month (~$5 USD)

All free features plus:
- Deep tafsir (Ibn Kathir, Al-Sa'di) — full
- Guidance queries — unlimited
- Knowledge graph — unlimited
- All 50+ Noor stories
- Complete 500 root words curriculum
- Hifz engine — full
- Taraweeh mode — full
- Personal journal — unlimited
- Life context personalization
- Audio recitations — all reciters
- Offline downloads — full

### Family — PKR 3,000/month (~$10 USD)

Pro features for 5 family members plus:
- Family dashboard (web)
- Children progress tracking
- "Tonight's dinner question" — weekly
- Shared family journal
- Parent controls for Noor mode

### Scholar/Institution — PKR 10,000/month

- Unlimited team accounts
- Advanced graph queries
- Bulk content export
- API access
- Priority support
- Attribution for institution

## 14.2 Pakistan Payment Integration

```
JazzCash     — Primary (largest Pakistan wallet)
EasyPaisa    — Secondary (second largest)
Bank transfer — Tertiary (for institutions)
Stripe       — International users
```

**Pakistani pricing psychology:**
- PKR 1,500/month = 3 cups of coffee = acceptable
- Annual discount: PKR 12,000/year (20% off = 2 months free)
- Family plan = 2x single = obvious value

## 14.3 International Pricing

| Region | Pro Monthly | Family Monthly |
|---|---|---|
| Pakistan/South Asia | $5 | $10 |
| Middle East | $8 | $15 |
| UK/Europe | $10 | $18 |
| USA/Canada | $10 | $18 |
| Malaysia/Indonesia | $6 | $12 |

## 14.4 Revenue Projections

**Conservative (Year 1):**
```
Free users:     10,000
Pro conversion: 3% = 300 users
Avg revenue:    $6/month
Monthly:        $1,800
Annual:         $21,600
```

**Moderate (Year 1-2):**
```
Free users:     50,000
Pro conversion: 5% = 2,500 users
Monthly:        $15,000
Annual:         $180,000
```

**Target (Year 2-3):**
```
Free users:     200,000
Pro conversion: 5% = 10,000 users
Monthly:        $60,000
Annual:         $720,000
```

---

# SECTION 15 — SCHOLAR PARTNERSHIP PLAN

## 15.1 Why This Is Non-Negotiable

```
Technical quality without scholar backing = 
"Another random Islamic app"

Scholar backing = 
"The most trusted Quran app in Pakistan"

One tweet from a respected alim = 
50,000 downloads overnight.

One criticism from a respected alim =
App finished.
```

## 15.2 Advisory Board — Ideal Profile

**Tier 1 — Core Advisors (2-3 scholars):**
- Active, respected, not controversial
- Digitally present (Twitter/YouTube following)
- Understands technology
- Agrees with "full Quran" vision

**Target institutions:**
- Wifaq ul Madaris (board review)
- Darul Uloom Karachi (digital-forward)
- International Islamic University Islamabad
- Any respected alim with social following

**Approach:**
1. Build working prototype first
2. Personal meeting — demonstrate sincerely
3. Show data architecture — how authenticity is preserved
4. Show "AI never generates — only retrieves" guarantee
5. Offer: Scholar name in app + revenue share (symbolic)

## 15.3 Content Review Process

```
All content → Scholar review queue
Scholar portal (web) → Review interface
Approve / Reject / Request revision
Version history maintained
User-facing: "Reviewed by [Scholar Name]"
```

## 15.4 Community Scholars Program

**Phase 2:**
- Verified scholars can submit thematic connections
- Community can flag incorrect content
- Monthly scholar review sessions (virtual)
- Open database of approved connections

---

# SECTION 16 — CONTENT STRATEGY & NOTEBOOKLM PIPELINE

## 16.1 Phase 1 Content Plan (Pre-Launch)

**Priority order:**

```
Week 1-4: Foundation content
- All 114 surahs — Tafsir Muyassar summaries (via NotebookLM)
- Verified Urdu translation import
- Root word dictionary (500 roots)
- Basic theme tagging (manual)

Week 5-8: Deep content
- Ibn Kathir summaries for Juz 1-10 (via NotebookLM)
- Sabab e Nuzool for common ayaat (Al-Wahidi)
- Story scripts — 5 Noor stories written
- Scholar review — first batch

Week 9-12: Polish
- Remaining stories (5 more)
- Knowledge graph seed connections
- Audio recording/integration
- Scholar final approval
```

## 16.2 NotebookLM Query Templates

```
Template 1 — Simple meaning:
"Based ONLY on the provided Tafsir Muyassar document,
 what is the simple, clear meaning of Surah [X], Ayah [Y]?
 Write in simple Urdu. Maximum 2 sentences.
 Cite the exact location in the document."

Template 2 — Context:
"Based ONLY on Al-Wahidi's Asbab al-Nuzool,
 what is the occasion of revelation for Surah [X], Ayah [Y]?
 If not mentioned, say 'Yeh ayah ke baare mein
 sabab e nuzool manzoor nahi hai.'
 Cite source."

Template 3 — Main lesson:
"Based ONLY on Ibn Kathir's tafsir as provided,
 what is ONE main lesson from Surah [X], Ayah [Y]?
 Write in simple Urdu. One sentence only.
 Cite Ibn Kathir directly."
```

## 16.3 Ongoing Content Pipeline

```
Monthly:
- 5 new Noor stories
- 100 new knowledge graph connections (scholar verified)
- New dimension deep-dives
- Seasonal content (Ramadan, Hajj, etc.)

Ramadan special:
- 30-day Taraweeh preparation series
- Para-by-para summaries
- Special kids Ramadan content
```

---

# SECTION 17 — LAUNCH STRATEGY

## 17.1 Pre-Launch (Month 1-3)

```
Build:
- Core Fahm mode (MVP)
- Basic knowledge graph (5 dimensions)
- 3 Noor stories
- Web landing page

Scholar:
- Approach 2-3 scholars
- Get at least 1 on board

Community:
- WhatsApp group — 100 beta testers
- Mostly friends, family, local mosque community

Social:
- Twitter/X — Islamic scholars follow
- Facebook — Pakistani Muslim communities
- TikTok/YouTube — "Did you know Quran says..."
  short clips (no app yet — just content)
```

## 17.2 Launch (Month 4)

**Android only. Pakistan first.**

```
Launch assets:
- App Store listing (optimized)
- Demo video (1 min — Urdu)
- Scholar endorsement post
- "Founder story" post:
  "Main taraweeh padhata hoon —
   samajh kuch nahi aata —
   yeh app maine apne liye banaya"

Launch channels:
- Scholar social media share
- Pakistani Muslim Facebook groups
- WhatsApp forwarding
- ProductHunt (international)
- IslamicFinder newsletter
```

## 17.3 Growth Strategy

**Core growth loop:**

```
User discovers Quran wisdom 
    ↓
Shares as beautiful card
    ↓
Friend sees → downloads
    ↓
Friend discovers wisdom
    ↓
Loop continues
```

**Content marketing:**
- Every ayah page on web = SEO
- "What does Quran say about [topic]" blog posts
- YouTube shorts — Urdu — "Quran ka yeh lafz..."
- Scholar shares = trust signals = organic installs

**Influencer strategy:**
- Islamic YouTube/TikTok creators (Pakistan)
- Not paid — genuine product demo
- Offer: Early access + feature requests

---

# SECTION 18 — 12-MONTH ROADMAP

## Month 1-2: Foundation

```
Week 1 — Data Bootstrap (FREE, $0 total):
✅ AbdullahGhanem/quran-database → surahs + ayahs + translations
✅ Abdallah-Mekky/Quran-Database → 3 tafsirs + tashkeel merged
✅ spa5k/tafsir_api → Ibn Kathir + Tabari + Muyassar per ayah
✅ AhmedBaset/hadith-json → 50,884 hadiths imported
✅ mustafa0x/quran-morphology → root words + word-by-word
✅ tanzil.net → Arabic text cross-verified
✅ everyayah.com → audio URL pattern configured
→ 90% data foundation complete. $0 spent.

Week 2-8 — Build:
✅ NotebookLM pipeline — sabab nuzool + Ibn Kathir Urdu
✅ MySQL schema (PRD Section 09) implemented
✅ NestJS API — core Quran endpoints
✅ Next.js — basic web reader
✅ Flutter — basic Android reading
```

## Month 3-4: Fahm MVP

```
✅ Flowing Tilawat mode
✅ Word-by-word breakdown
✅ 5 root words curriculum (Level 1 start)
✅ Basic personal journal
✅ User auth (phone OTP)
✅ Scholar advisory — first engagement
✅ Beta testing — 100 users
```

## Month 5-6: Launch

```
✅ NOOR mode — 5 stories (Android)
✅ Guidance mode (RAG — basic)
✅ Knowledge graph — 3 dimensions
✅ Web landing + 3 surah pages (SEO test)
✅ Payment integration (JazzCash + EasyPaisa)
✅ Pro tier launch
✅ Android launch (Pakistan)
```

## Month 7-8: Deepen

```
✅ EXPLORE mode launch
✅ Full 10 dimensions
✅ Hifz engine
✅ Taraweeh mode (pre-Ramadan)
✅ Family accounts
✅ 10 more Noor stories
✅ SEO — 500 ayah pages live
```

## Month 9-10: Scale

```
✅ Ramadan mega campaign
✅ 30-day Taraweeh preparation
✅ iOS beta
✅ International pricing
✅ Knowledge graph — visual explorer (web)
✅ Scholar Community Program launch
✅ 50 Noor stories
```

## Month 11-12: Expand

```
✅ iOS public launch
✅ English interface (international Muslim market)
✅ Arabic interface (Arab world)
✅ Advanced personalization (ML)
✅ API for Islamic institutions
✅ 500 roots complete curriculum
✅ 10,000+ users target
```

---

# SECTION 19 — RISK & MITIGATION

## 19.1 Risk Matrix

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| AI generates wrong Islamic content | Medium | Catastrophic | Strict RAG — never generate, only retrieve. Scholar review all content before publish. |
| Scholar opposition | Medium | High | Early engagement. Transparent process. Show authenticity guarantees. |
| Maslak controversy | Medium | High | Strict neutrality — only universally accepted content. No fiqhi positions. |
| Scope creep | High | Medium | Phase gates. "Ship first" philosophy. One mode MVP. |
| Data accuracy errors | Low | High | Multiple source verification. User flagging. Scholar review queue. |
| Competition from Quran.com | Low | Medium | Different product. They are read-only. Our moat is personalization + graph. |
| Low retention | Medium | High | Daily habit features. Push notifications. Streaks (meaningful). |
| Pakistan payment friction | Medium | Medium | JazzCash + EasyPaisa + SMS billing. Make payment as easy as possible. |

## 19.2 The Maslak Neutrality Policy (Critical)

```
ALLOWED in app:
✅ Tafsir from scholars accepted across all schools
✅ Arabic text (Hafs an Asim — universal)
✅ Factual historical context
✅ Science connections (peer-reviewed only)
✅ General Islamic ethics (agreed upon)

NEVER in app:
❌ Any position on Deobandi/Barelvi differences
❌ Any position on Salafi/Sufi differences
❌ Fiqhi rulings (halal/haram specific)
❌ Political Islam positions
❌ Any specific scholar as "the only correct" view
❌ Content that could be seen as dawah for a maslak
```

## 19.3 Content Safety

```
Every content item has:
- Source field (required, non-null)
- Scholar approval field
- Version history
- User flag counter

If flag count > threshold → auto-hide → scholar review queue
```

---

# SECTION 20 — SUCCESS METRICS

## 20.1 North Star Metric

> **"Number of users who said Quran changed their understanding of their own life situation"**

This is measured through:
- Journal entries with life context tags
- User survey (monthly): "Has this app changed how you relate to Quran?"
- Qualitative stories (testimonials)

## 20.2 Product Metrics

| Metric | Month 3 | Month 6 | Month 12 |
|---|---|---|---|
| Total downloads | 500 | 5,000 | 25,000 |
| Daily Active Users | 150 | 1,500 | 8,000 |
| D30 Retention | 20% | 30% | 40% |
| Pro conversion | 2% | 4% | 6% |
| MRR | $500 | $5,000 | $25,000 |
| Journal entries created | 200 | 5,000 | 50,000 |
| Root words learned | 1,000 | 25,000 | 200,000 |
| Guidance queries | 100 | 2,000 | 20,000 |

## 20.3 Mission Metrics

| Metric | Description |
|---|---|
| "Understood Quran" users | Users who completed 30+ days with understanding mode |
| Cross-dimension connections | Total knowledge graph nodes user has explored |
| Non-Muslim users | Explore mode users |
| Children active (Noor) | Kids using app regularly |
| Scholar endorsements | Named scholars on advisory board |
| Content accuracy score | % content with scholar approval |

## 20.4 The Real Metric

```
10 years from now:

If one person became a doctor
because Quran's verse on healing
inspired them through Al-Huda —

If one businessman built an ethical company
because Quran's economic principles
became real to him through Al-Huda —

If one child grew up understanding
every word they recite —

If one non-Muslim found peace
through Quranic wisdom,
without pressure, without judgment —

Yeh product successful hai.
Numbers secondary hain.
```

---

# APPENDIX A — COMPETITIVE ANALYSIS

| Feature | Quran.com | Muslim Pro | Zikr | **Al-Huda** |
|---|---|---|---|---|
| Arabic text | ✅ | ✅ | ✅ | ✅ |
| Translation | ✅ | ✅ | ✅ | ✅ |
| Tafsir | Basic | Basic | None | Deep + Multi-level |
| Knowledge graph | ❌ | ❌ | ❌ | ✅ Core feature |
| Personalization | ❌ | ❌ | ❌ | ✅ Life-context |
| Guidance mode | ❌ | ❌ | ❌ | ✅ RAG-powered |
| Kids mode | ❌ | ❌ | ❌ | ✅ Story mode |
| Arabic learning | ❌ | ❌ | ❌ | ✅ 500 roots |
| Non-Muslim mode | ❌ | ❌ | ❌ | ✅ Explore mode |
| Root word system | ❌ | ❌ | ❌ | ✅ Full curriculum |
| Hifz engine | Basic | Basic | ❌ | ✅ Smart SRS |
| 10 dimensions | ❌ | ❌ | ❌ | ✅ Complete |
| Offline | Partial | ✅ | Partial | ✅ Full |
| Pakistan payments | ❌ | ❌ | ❌ | ✅ JazzCash/EasyPaisa |
| Urdu-first | ❌ | ❌ | ❌ | ✅ Primary language |

---

# APPENDIX B — FOUNDING PHILOSOPHY

```
"Main taraweeh padhata hoon.
 Samajh kuch nahi aata."

Yeh ek founder ka dard hai.
Yeh 100 million Muslims ka dard hai.

Al-Huda us din ke liye bana:
Jab Dawood pehli baar
Taraweeh mein —
roya —
kyunke pata tha —
Allah kya keh raha tha.

Aur jab Hania ne — 7 saal mein —
apne abbu ko bataya:
"Abbu — yeh toh Quran wala lafz hai na?"

Woh din —
product ka success hai.
Numbers nahi.
```

---

*Document Version: 1.0*
*Status: Complete — Ready for Development*
*Next Step: Scholar engagement + Data pipeline setup*

---

> *"وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ"*
> *"My success is only through Allah"*
> — Hud 11:88
# AL-HUDA — UI/UX COMPLETE SPECIFICATION
## Section 21 — Full Design System & Screen Flows

---

> **Design Principle:** One screen. One purpose. Zero confusion.
> Every user — 7-year-old child or 60-year-old scholar — navigates without thinking.

---

# 21.1 DESIGN SYSTEM

## 21.1.1 Color Palette

```
PRIMARY COLORS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Deep Teal (Primary)    #1B4F72   — Main actions, headers
Gold (Accent)          #D4A843   — Arabic text highlight, stars
Cream (Background)     #FDF6E3   — App background (warm, easy on eyes)
Midnight (Dark mode)   #0D1117   — Night/Taraweeh mode

SECONDARY COLORS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Soft Green             #2D7A4F   — Success, Sahih grade
Amber                  #E8A020   — Hasan grade, warnings
Coral                  #E74C3C   — Errors, Da'if warning
Light Blue             #AED6F1   — EXPLORE mode accent
Purple                 #7D3C98   — NOOR mode accent

MODE COLORS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NOOR mode    → Purple gradient  #7D3C98 → #A569BD
FAHM mode    → Teal gradient    #1B4F72 → #2E86C1
EXPLORE mode → Blue gradient    #1A5276 → #2471A3
```

## 21.1.2 Typography

```
ARABIC TEXT:
Font: Amiri (Google Fonts — free)
Sizes:
  Tilawat (reading):   32sp
  Inline (story):      24sp
  Reference compact:   18sp
  Word breakdown:      28sp
Direction: RTL always
Line height: 2.2x (Arabic needs breathing room)

URDU TEXT:
Font: Noto Nastaliq Urdu (Google Fonts — free)
Sizes:
  Body meaning:   16sp
  Compact:        13sp
  Caption:        11sp
Direction: RTL

ENGLISH / LATIN:
Font: Inter (clean, readable)
Sizes:
  Body:      16sp
  Sub:       14sp
  Caption:   12sp
  Button:    14sp bold
Direction: LTR

NUMBERS (ayah, hadith):
Font: Amiri for Arabic numerals
      Inter for Latin numerals
```

## 21.1.3 Spacing & Layout

```
Base unit: 8dp

Margins:
  Screen edges:    16dp
  Card padding:    20dp
  Section gap:     24dp
  Element gap:     12dp
  Tight gap:       8dp

Safe areas:
  Top:     StatusBar + 8dp
  Bottom:  NavBar + 16dp
```

## 21.1.4 Component Library

```
CARDS:
  AyahCard        — Arabic + Urdu + ReferenceBar
  HadithCard      — Arabic + Urdu + Grade + ReferenceBar
  StoryCard       — Illustration + Title + Progress
  RootWordCard    — Root + Derivatives + Frequency
  ThemeCard       — Icon + Name + Ayah count

BUTTONS:
  Primary         — Filled Teal — main CTA
  Secondary       — Outlined Teal
  Ghost           — Text only
  IconButton      — 48x48dp touch target (accessibility)
  FAB             — Floating action

NAVIGATION:
  BottomNav       — 5 tabs — icon + label
  TopBar          — Back + Title + Actions
  ModeSelector    — NOOR / FAHM / EXPLORE switcher

OVERLAYS:
  BottomSheet     — Reference details, tafsir depth
  Dialog          — Confirmation only
  Snackbar        — Non-blocking feedback
  Tooltip         — Arabic word meaning on tap
```

---

# 21.2 APP LAUNCH & ONBOARDING

## 21.2.1 Splash Screen

```
┌─────────────────────────────────┐
│                                 │
│                                 │
│         [App Logo]              │
│                                 │
│      ● ● ●  (loading dots)      │
│                                 │
│   "الهدى"  in Amiri font        │
│                                 │
└─────────────────────────────────┘

Duration: 2 seconds
Background: Deep Teal gradient
Logo: Stylized ه (Huda letter) in Gold
Animation: Logo fades in → dots pulse → transition
```

## 21.2.2 Language Selection (First Launch Only)

```
┌─────────────────────────────────┐
│  Choose Your Language           │
│  اپنی زبان منتخب کریں           │
├─────────────────────────────────┤
│                                 │
│  🇵🇰  اردو          [●]         │
│  🇬🇧  English       [ ]         │
│  🇸🇦  العربية       [ ]         │
│  🇮🇳  हिन्दी         [ ]         │
│  🇧🇩  বাংলা          [ ]         │
│  + 16 more languages            │
│                                 │
├─────────────────────────────────┤
│      [آگے چلیں →]               │
└─────────────────────────────────┘

Default: Detect from device locale
Skip: Allowed — can change in settings
```

## 21.2.3 Mode Selection Screen

```
┌─────────────────────────────────┐
│                                 │
│   السَّلاَمُ عَلَيْكُمْ        │
│   آپ کون ہیں؟                   │
│                                 │
├─────────────────────────────────┤
│                                 │
│  ┌──────────────────────────┐   │
│  │  🌙  میرا بچہ            │   │
│  │      عمر 3-12 سال        │   │
│  │      کہانیاں اور سیکھنا  │   │
│  └──────────────────────────┘   │
│                                 │
│  ┌──────────────────────────┐   │
│  │  📖  میں مسلمان ہوں      │   │
│  │      قرآن سمجھنا ہے      │   │
│  │      فہم اور ہدایت       │   │
│  └──────────────────────────┘   │
│                                 │
│  ┌──────────────────────────┐   │
│  │  🔍  جاننا چاہتا ہوں     │   │
│  │      اسلام کے بارے میں  │   │
│  │      کوئی دباؤ نہیں     │   │
│  └──────────────────────────┘   │
│                                 │
└─────────────────────────────────┘

Tap any card → Mode-specific onboarding
Cards: Large, full-width, rounded corners
Selected: Gold border highlight
Animation: Card scales up on tap
```

---

# 21.3 NOOR MODE — COMPLETE FLOW

## 21.3.1 NOOR Onboarding (Parent fills this)

```
SCREEN 1 — Child Profile
┌─────────────────────────────────┐
│  🌙 NOOR                        │
│  اپنے بچے کے بارے میں بتائیں  │
├─────────────────────────────────┤
│                                 │
│  بچے کا نام:                   │
│  ┌─────────────────────────┐   │
│  │  حانیہ                  │   │
│  └─────────────────────────┘   │
│                                 │
│  عمر:                           │
│  [3] [4] [5] [6] [7] [8]       │
│  [9] [10] [11] [12]             │
│                                 │
│  لڑکا / لڑکی:                  │
│  [لڑکا 👦]  [لڑکی 👧]          │
│                                 │
│       [اگلا →]                  │
└─────────────────────────────────┘

SCREEN 2 — Story Selection
┌─────────────────────────────────┐
│  کہاں سے شروع کریں؟            │
├─────────────────────────────────┤
│  ┌──────┐ ┌──────┐ ┌──────┐   │
│  │ 🌟   │ │ ⛵   │ │ 🔥   │   │
│  │یوسف  │ │ نوح  │ │ابراہیم│  │
│  │ AS   │ │  AS  │ │  AS  │   │
│  └──────┘ └──────┘ └──────┘   │
│  ┌──────┐ ┌──────┐ ┌──────┐   │
│  │ 🐟   │ │ 👑   │ │ 🌸   │   │
│  │یونس  │ │موسیٰ │ │مریم  │   │
│  │  AS  │ │  AS  │ │  AS  │   │
│  └──────┘ └──────┘ └──────┘   │
│                                 │
│  "آپ کا بچہ پہلی کہانی سنے گا"│
│       [شروع کریں ✨]            │
└─────────────────────────────────┘
```

## 21.3.2 NOOR Home Screen

```
┌─────────────────────────────────┐
│  🌙 نور   حانیہ 👋              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│                                 │
│  آج کی کہانی:                  │
│  ┌───────────────────────────┐  │
│  │  [Illustration: Stars]    │  │
│  │                           │  │
│  │  حضرت یوسف علیہ السلام   │  │
│  │  قسط ۳ — کنواں           │  │
│  │                           │  │
│  │  ▶ کہانی سنیں   [5 min]  │  │
│  └───────────────────────────┘  │
│                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│  آج کا لفظ ✨                   │
│  ┌───────────────────────────┐  │
│  │   صَبَرَ   =  صبر کیا    │  │
│  │   قرآن میں: ۹۰+ بار      │  │
│  └───────────────────────────┘  │
│                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│  🏆 ۵ دن کی streak! 🔥         │
│                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│  [🏠Home] [📖Stories] [⭐Words] │
│        [📊Progress] [👤Profile] │
└─────────────────────────────────┘
```

## 21.3.3 Story Player Screen — NOOR

```
┌─────────────────────────────────┐
│  ←  حضرت یوسف AS   قسط ۳      │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│                                 │
│  ┌───────────────────────────┐  │
│  │                           │  │
│  │   [Beautiful Illustration]│  │
│  │   Night sky, stars, well  │  │
│  │                           │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ 👵🏽 دادی جان:             │  │
│  │                           │  │
│  │  "بیٹا — یوسف علیہ السلام│  │
│  │   کنویں میں تھے —        │  │
│  │   اندھیرا تھا —          │  │
│  │   لیکن اللہ نے فرمایا:"  │  │
│  │                           │  │
│  │  ┌─────────────────────┐  │  │
│  │  │  وَاللَّهُ مَعَكُمْ │  │  │
│  │  │  "اللہ تمہارے ساتھ" │  │  │
│  │  │  [الحدید ۵۷:۴ ↗]    │  │  │
│  │  └─────────────────────┘  │  │
│  │                           │  │
│  │  "حانیہ — کیا تم بھی     │  │
│  │   ڈرتی ہو کبھی کبھی؟"   │  │
│  └───────────────────────────┘  │
│                                 │
│  [━━━━━━━━●━━━━━] 3:24 / 5:10  │
│                                 │
│    ⏮  ▶/⏸  ⏭   🔊  [✨Next]    │
└─────────────────────────────────┘

Behavior:
→ Audio plays automatically
→ Text syncs with audio (word highlight)
→ Arabic ayah appears with animation
→ Reference bar always visible
→ "حانیہ" = child's actual name throughout
→ Tap Arabic ayah → expands to full ReferenceBar
→ ✨Next = next scene (not next episode)
```

## 21.3.4 Arabic Word Discovery — In Story

```
When Roshni 🦋 glows on a word:

┌─────────────────────────────────┐
│     ✨ رُوشنی کہتی ہے!          │
│                                 │
│  ┌───────────────────────────┐  │
│  │                           │  │
│  │        صَبَرَ             │  │
│  │     Sa - ba - ra          │  │
│  │                           │  │
│  │   "اس نے صبر کیا"         │  │
│  │                           │  │
│  │  Root: ص - ب - ر           │  │
│  │  قرآن میں ۹۰+ بار         │  │
│  │                           │  │
│  │  مزید الفاظ:              │  │
│  │  صَبَرَ = صبر کیا         │  │
│  │  یَصْبِرُ = صبر کرتا ہے  │  │
│  │  صَبُوْر = بہت صبر والا  │  │
│  │                           │  │
│  └───────────────────────────┘  │
│                                 │
│  [✅ سمجھ گئی!] [🔁 دوبارہ]    │
└─────────────────────────────────┘

Animation: Bottom sheet slides up
Background: Blurred story screen
Roshni firefly: Animated around word
```

## 21.3.5 Story Complete Screen

```
┌─────────────────────────────────┐
│                                 │
│       ⭐ ⭐ ⭐                   │
│   شاباش حانیہ! بہت اچھے!       │
│                                 │
│  آج آپ نے سیکھا:               │
│  ┌───────────────────────────┐  │
│  │  صَبَرَ  =  صبر کیا      │  │
│  │  رَأَيۡتُ = میں نے دیکھا │  │
│  │  وَاللَّه = اور اللہ     │  │
│  └───────────────────────────┘  │
│                                 │
│  💬 امی ابو سے پوچھیں:         │
│  "یوسف کے کتنے بھائی تھے؟"    │
│                                 │
│  [🌟 اگلی قسط]  [🏠 گھر]       │
└─────────────────────────────────┘

Confetti animation on enter
Stars animate in one by one
```

## 21.3.6 NOOR — Personalized Story Request

```
SCREEN — Parent creates story

┌─────────────────────────────────┐
│  ←  حانیہ کے لیے کہانی         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│                                 │
│  آج کیا ہوا؟                   │
│                                 │
│  یا منتخب کریں:                │
│  ┌──────┐ ┌──────┐ ┌──────┐   │
│  │ 🤥   │ │ 😤   │ │ 👊   │   │
│  │جھوٹ │ │غصہ  │ │جھگڑا │  │
│  └──────┘ └──────┘ └──────┘   │
│  ┌──────┐ ┌──────┐ ┌──────┐   │
│  │ 😢   │ │ 🙈   │ │ 🍽️   │   │
│  │دوست  │ │نماز  │ │کھانا │  │
│  │دکھی  │ │نہیں  │ │ضائع │  │
│  └──────┘ └──────┘ └──────┘   │
│                                 │
│  یا خود لکھیں:                 │
│  ┌───────────────────────────┐  │
│  │  آج اس نے اپنی دوست سے  │  │
│  │  جھوٹ بولا...             │  │
│  └───────────────────────────┘  │
│                                 │
│   [✨ کہانی بنائیں]             │
└─────────────────────────────────┘

Loading state (10 seconds):
"حانیہ کے لیے خاص کہانی بن رہی ہے... ✨"
Animated Roshni firefly
```

---

# 21.4 FAHM MODE — COMPLETE FLOW

## 21.4.1 FAHM Onboarding

```
SCREEN 1 — Arabic Level
┌─────────────────────────────────┐
│  📖 فہم                         │
│  آپ قرآن کے ساتھ کہاں ہیں؟    │
├─────────────────────────────────┤
│                                 │
│  ○ بالکل نیا ہوں               │
│    عربی نہیں آتی               │
│                                 │
│  ○ پڑھ لیتا ہوں                │
│    مطلب نہیں پتہ               │
│                                 │
│  ○ حافظ ہوں                    │
│    گہرائی چاہتا ہوں             │
│                                 │
│  ○ عالم ہوں                    │
│    تحقیق کے لیے                │
│                                 │
│       [اگلا →]                  │
└─────────────────────────────────┘

SCREEN 2 — Life Context
┌─────────────────────────────────┐
│  اپنے بارے میں بتائیں          │
│  (قرآن آپ کے لیے personalize ہو)│
├─────────────────────────────────┤
│                                 │
│  پیشہ:                          │
│  [کاروبار] [طالب علم] [والدین] │
│  [ڈاکٹر] [انجینئر] [معلم]     │
│  [+ مزید]                       │
│                                 │
│  ابھی زندگی میں:               │
│  [سکون چاہیے] [رہنمائی]        │
│  [پریشانی ہے] [شکرگزاری]      │
│                                 │
│  زبان:                          │
│  [اردو ●] [English] [عربی]     │
│                                 │
│       [شروع کریں]               │
└─────────────────────────────────┘
```

## 21.4.2 FAHM Home Screen

```
┌─────────────────────────────────┐
│  السَّلاَمُ عَلَيْكُم  داود 👋  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│                                 │
│  جاری ہے:                       │
│  ┌───────────────────────────┐  │
│  │  سورة البقرة — آیت ۱۵۳   │  │
│  │  ══════●══════════ ۴۸%   │  │
│  │  [▶ جاری رکھیں]           │  │
│  └───────────────────────────┘  │
│                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│  آج کی رہنمائی ✨               │
│  ┌───────────────────────────┐  │
│  │  "قرآن میرے کاروبار کے   │  │
│  │   بارے میں کیا کہتا ہے؟" │  │
│  │                           │  │
│  │  [🔍 پوچھیں]              │  │
│  └───────────────────────────┘  │
│                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│  آج کی جڑ 🌱                   │
│  ┌───────────────────────────┐  │
│  │  ر - ح - م  (رحمت)       │  │
│  │  قرآن میں: ۳۳۸ بار       │  │
│  └───────────────────────────┘  │
│                                 │
│  [🏠] [📖تلاوت] [🔍ہدایت]      │
│        [🧠سیکھیں] [👤پروفائل]   │
└─────────────────────────────────┘
```

## 21.4.3 Tilawat (Reading) Screen — Fahm Mode

```
┌─────────────────────────────────┐
│  ← سورة البقرة       [⚙️] [🔖] │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│                                 │
│  ┌───────────────────────────┐  │
│  │                           │  │
│  │  يَا أَيُّهَا الَّذِينَ  │  │
│  │  آمَنُوا اسْتَعِينُوا    │  │
│  │  بِالصَّبْرِ             │  │
│  │  وَالصَّلَاةِ            │  │
│  │                           │  │
│  │  ─────────────────────   │  │
│  │  "اے ایمان والو! صبر     │  │
│  │   اور نماز سے مدد لو"    │  │
│  │                           │  │
│  │  📖 سورة البقرة ۲:۱۵۳   │  │
│  │  🔗 quran.com/2:153 ↗    │  │
│  │  📚 [ابن کثیر↗] [سعدی↗]  │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ 💡 مطلب (آسان):           │  │
│  │  اللہ مشکل وقت میں       │  │
│  │  صبر اور نماز کا          │  │
│  │  سہارا لینے کو کہتا ہے   │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ 🕌 یہ آیت کیوں آئی:      │  │
│  │  مسلمانوں کو مشکل وقت   │  │
│  │  میں ثابت قدم رہنے کی    │  │
│  │  تعلیم دی گئی            │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ ⚡ آج کے لیے:             │  │
│  │  کیا آپ کی نماز conscious │  │
│  │  ہے یا mechanical؟       │  │
│  └───────────────────────────┘  │
│                                 │
│      [❤️ محفوظ] [⬇️ اگلی]      │
└─────────────────────────────────┘

DEPTH SELECTOR (tap ⚙️):
[سادہ ●] [درمیانہ] [گہرا] [عالمانہ]
→ Changes how much tafsir shows
→ Persists across sessions
```

## 21.4.4 Word-by-Word Breakdown

```
Tap any Arabic word:

┌─────────────────────────────────┐
│  ← لفظ کی تفصیل               │
│                                 │
│  ┌───────────────────────────┐  │
│  │                           │  │
│  │       الصَّلَاةِ          │  │
│  │     as-salaati            │  │
│  │                           │  │
│  └───────────────────────────┘  │
│                                 │
│  مطلب: نماز / عبادت            │
│                                 │
│  جڑ: ص - ل - و                 │
│  بنیادی معنی: جوڑنا، ملانا     │
│                                 │
│  قرآن میں: ۹۸ بار              │
│  مختلف شکلیں:                   │
│  صَلَّى   = اس نے نماز پڑھی   │
│  يُصَلِّي = نماز پڑھتا ہے     │
│  الصَّلَاة = نماز              │
│  مُصَلِّي = نماز پڑھنے والا   │
│                                 │
│  ┌───────────────────────────┐  │
│  │ 📖 اس لفظ کی مزید آیات  │  │
│  │  البقرة 2:43  ↗           │  │
│  │  البقرة 2:110 ↗           │  │
│  │  النساء 4:43  ↗           │  │
│  └───────────────────────────┘  │
│                                 │
│  [🔖 یاد کریں] [✕ بند کریں]   │
└─────────────────────────────────┘
```

## 21.4.5 Guidance Mode Screen

```
┌─────────────────────────────────┐
│  ←  قرآن سے پوچھیں            │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│                                 │
│  اپنی بات لکھیں:               │
│  ┌───────────────────────────┐  │
│  │  میرے بزنس پارٹنر نے    │  │
│  │  دھوکہ دیا — کیا کروں؟  │  │
│  └───────────────────────────┘  │
│                                 │
│  [🔍 قرآن میں ڈھونڈیں]         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│                                 │
│  قرآن کا جواب:                 │
│                                 │
│  ┌───────────────────────────┐  │
│  │  وَمَن يَتَّقِ اللَّهَ   │  │
│  │  يَجْعَل لَّهُ مَخْرَجًا │  │
│  │                           │  │
│  │  "جو اللہ سے ڈرے —       │  │
│  │   اللہ اس کے لیے         │  │
│  │   راستہ نکالتا ہے"       │  │
│  │                           │  │
│  │  📖 الطلاق ۶۵:۲-۳        │  │
│  │  🔗 quran.com/65:2 ↗      │  │
│  │  📚 [ابن کثیر ↗]          │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │  وَمَا كَانَ اللَّهُ     │  │
│  │  لِيَظْلِمَهُمْ          │  │
│  │  "اللہ انہیں ظلم نہ کرے" │  │
│  │  📖 آل عمران ۳:۱۱۷ ↗     │  │
│  └───────────────────────────┘  │
│                                 │
│  ─────────────────────────────  │
│  ⚠️ مخصوص مسائل کے لیے        │
│     کسی عالم سے ضرور ملیں      │
│  ─────────────────────────────  │
│                                 │
│  [❤️ محفوظ کریں]               │
└─────────────────────────────────┘
```

## 21.4.6 Taraweeh Mode Screen

```
Entry: Settings → Taraweeh Mode ON
       OR Ramadan auto-suggest

┌─────────────────────────────────┐
│  تراویح موڈ 🌙                  │
│  رمضان المبارک                  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│                                 │
│  آج رات: پارہ ۳                │
│  سورة البقرة: آیت ۲۵۳ سے      │
│                                 │
│  ┌───────────────────────────┐  │
│  │                           │  │
│  │  وَتِلْكَ الرُّسُلُ      │  │
│  │  فَضَّلْنَا بَعْضَهُمْ  │  │
│  │  عَلَىٰ بَعْضٍ           │  │
│  │                           │  │
│  │  "یہ رسول — ہم نے انہیں  │  │
│  │   ایک دوسرے پر فضیلت دی" │  │
│  │                           │  │
│  │  البقرة ۲:۲۵۳ ↗          │  │
│  └───────────────────────────┘  │
│                                 │
│  [◀ پچھلی]    [اگلی ▶]         │
│                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│  [× تراویح موڈ بند کریں]       │
└─────────────────────────────────┘

UI Rules for Taraweeh Mode:
→ Full dark mode (midnight black)
→ ONLY Arabic + Urdu — nothing else
→ No icons, no notifications
→ Keep screen always on
→ Font size +4sp
→ No bottom navigation bar
→ Single tap = next ayah
→ Reference: compact one-line only
→ No share, no bookmark buttons visible
→ Exit via X only (prevent accidental)
```

## 21.4.7 Hifz (Memorization) Screen

```
┌─────────────────────────────────┐
│  ←  حفظ                        │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│                                 │
│  آج کا سبق:                    │
│  سورة الملک — آیت ۱-۵          │
│                                 │
│  ┌───────────────────────────┐  │
│  │                           │  │
│  │   تَبَارَكَ الَّذِي      │  │
│  │   بِيَدِهِ الْمُلْكُ     │  │
│  │                           │  │
│  │   [▶ سنیں] [🎤 پڑھیں]   │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │  تَبَارَكَ ___________   │  │
│  │  بِيَدِهِ ______________  │  │
│  │  [خالی جگہ بھریں]        │  │
│  └───────────────────────────┘  │
│                                 │
│  طاقت: ████████░░ ۸۰%          │
│  اگلا دہرانا: کل صبح           │
│                                 │
│  [✅ یاد ہے] [🔁 دوبارہ]       │
└─────────────────────────────────┘
```

## 21.4.8 Knowledge Graph Screen

```
┌─────────────────────────────────┐
│  ←  علم کا جال 🕸️              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│                                 │
│  مرکز: صبر                     │
│                                 │
│  ┌───────────────────────────┐  │
│  │      [Graph Visualization]│  │
│  │                           │  │
│  │   تو    ●صبر●    شکر     │  │
│  │  کل  ╱   |   ╲  تقویٰ  │  │
│  │    ╱    |     ╲          │  │
│  │  رحم   دعا   توکل       │  │
│  │                           │  │
│  └───────────────────────────┘  │
│                                 │
│  "صبر" — ۹۰ آیات               │
│  ┌───────────────────────────┐  │
│  │  البقرة ۲:۱۵۳  ↗         │  │
│  │  آل عمران ۳:۲۰۰ ↗        │  │
│  │  الزمر ۳۹:۱۰  ↗          │  │
│  │  + ۸۷ مزید               │  │
│  └───────────────────────────┘  │
│                                 │
│  [🔍 تلاش] [فلٹر ▼] [+ بڑھائیں]│
└─────────────────────────────────┘

Mobile: Simplified graph
Web: Full D3.js interactive graph
Tap node → Center shifts to that node
Pinch to zoom
```

---

# 21.5 EXPLORE MODE — COMPLETE FLOW

## 21.5.1 EXPLORE Onboarding

```
SCREEN 1 — Zero pressure entry
┌─────────────────────────────────┐
│  🔍 دریافت کریں                 │
│  Explore                        │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│                                 │
│  آپ یہاں کیوں آئے؟             │
│  Why are you here?              │
│                                 │
│  ○ Just curious about Islam     │
│  ○ Have Muslim friends/family   │
│  ○ Searching for peace/meaning  │
│  ○ Academic research            │
│  ○ Heard something about Quran  │
│                                 │
│  ─────────────────────────────  │
│  ℹ️ No account needed.          │
│     No pressure. Ever.          │
│  ─────────────────────────────  │
│                                 │
│       [Continue →]              │
└─────────────────────────────────┘

SCREEN 2 — Personalization
┌─────────────────────────────────┐
│  What matters most to you?      │
│  (We'll show relevant wisdom)   │
├─────────────────────────────────┤
│                                 │
│  [☮️ Peace & Mental Health]     │
│  [⚖️ Justice & Ethics]          │
│  [🔬 Science & Knowledge]       │
│  [👨‍👩‍👧 Family & Relationships]   │
│  [💰 Business & Finance]        │
│  [🌍 Society & Community]       │
│                                 │
│  Select all that apply          │
│                                 │
│       [Start Exploring →]       │
└─────────────────────────────────┘
```

## 21.5.2 EXPLORE Home Screen

```
┌─────────────────────────────────┐
│  Explore Al-Quran 🔍            │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│                                 │
│  Because you care about peace:  │
│                                 │
│  ┌───────────────────────────┐  │
│  │  أَلَا بِذِكْرِ اللَّهِ  │  │
│  │  تَطْمَئِنُّ الْقُلُوبُ  │  │
│  │                           │  │
│  │  "Verily, in the          │  │
│  │   remembrance of God      │  │
│  │   do hearts find rest."   │  │
│  │                           │  │
│  │  📖 Ar-Ra'd 13:28 ↗       │  │
│  │  Revealed 1,400 years ago  │  │
│  └───────────────────────────┘  │
│                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│  Explore topics:                │
│  [Peace] [Family] [Justice]     │
│  [Science] [Forgiveness] [More] │
│                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│  Common Questions:              │
│  "What does Islam say about..." │
│  [violence] [women] [jihad]     │
│                                 │
│  [🏠] [🔍Search] [❓FAQ]        │
│       [💾Saved] [⚙️Settings]    │
└─────────────────────────────────┘
```

## 21.5.3 Misconceptions Screen

```
┌─────────────────────────────────┐
│  ←  Common Questions            │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│                                 │
│  "What does Jihad actually mean?"│
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│                                 │
│  The Quran mentions 4 levels:   │
│                                 │
│  ┌───────────────────────────┐  │
│  │  1️⃣  Jihad al-Nafs       │  │
│  │  Struggle against your   │  │
│  │  own ego/desires         │  │
│  │  → "The greatest Jihad"  │  │
│  │  [Prophet's saying ↗]    │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │  2️⃣  Jihad bil-Qalam     │  │
│  │  Struggle through        │  │
│  │  knowledge & writing     │  │
│  │  Al-Furqan 25:52 ↗       │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │  3️⃣  Jihad bil-Maal      │  │
│  │  Struggle through        │  │
│  │  giving resources        │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │  4️⃣  Armed struggle      │  │
│  │  Last resort only —      │  │
│  │  strict conditions       │  │
│  │  Al-Baqarah 2:190 ↗      │  │
│  └───────────────────────────┘  │
│                                 │
│  Every reference is clickable.  │
│  Verify everything yourself. ↗  │
└─────────────────────────────────┘
```

---

# 21.6 CROSS-MODE SCREENS

## 21.6.1 Search Screen

```
┌─────────────────────────────────┐
│  🔍 تلاش کریں                  │
│  ┌───────────────────────────┐  │
│  │  صبر / patience / sabr   │  │
│  └───────────────────────────┘  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│  فلٹر: [آیات ●] [احادیث] [سب] │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│                                 │
│  ۹۰ آیات ملیں:                 │
│                                 │
│  البقرة ۲:۱۵۳                  │
│  ...اسْتَعِينُوا بِالصَّبْرِ... │
│  "صبر اور نماز سے مدد لو"      │
│  [ابن کثیر ↗] [quran.com ↗]    │
│  ─────────────────────────────  │
│                                 │
│  آل عمران ۳:۲۰۰                │
│  ...اصْبِرُوا وَصَابِرُوا...   │
│  "صبر کرو اور ثابت رہو"        │
│  [سعدی ↗] [quran.com ↗]        │
│  ─────────────────────────────  │
└─────────────────────────────────┘
```

## 21.6.2 Personal Journal Screen

```
┌─────────────────────────────────┐
│  ←  میرا ذاتی قرآن             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│                                 │
│  ۱۵ مارچ ۲۰۲۵                  │
│  ┌───────────────────────────┐  │
│  │  وَاللَّهُ مَعَكُمْ       │  │
│  │  "اللہ تمہارے ساتھ ہے"   │  │
│  │  الحدید ۵۷:۴ ↗           │  │
│  │                           │  │
│  │  📝 میرا نوٹ:             │  │
│  │  "آج بزنس میں نقصان      │  │
│  │   ہوا — یہ آیت نے        │  │
│  │   سکون دیا"               │  │
│  └───────────────────────────┘  │
│                                 │
│  ۱۰ مارچ ۲۰۲۵                  │
│  ┌───────────────────────────┐  │
│  │  إِنَّ مَعَ الْعُسْرِ يُسْرًا│
│  │  "مشکل کے ساتھ آسانی ہے" │  │
│  │  الشرح ۹۴:۵ ↗             │  │
│  └───────────────────────────┘  │
│                                 │
│  [+ نئی آیت شامل کریں]         │
└─────────────────────────────────┘
```

## 21.6.3 Settings Screen

```
┌─────────────────────────────────┐
│  ←  ترتیبات                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│                                 │
│  موڈ                            │
│  [🌙نور] [📖فہم●] [🔍دریافت]  │
│                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│  ترجمہ                          │
│  اردو — جالندھری        [بدلیں] │
│                                 │
│  تفسیر کی گہرائی                │
│  [سادہ] [درمیانہ●] [گہرا]      │
│                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│  AI Provider                    │
│  Al-Huda Default (GLM)  [بدلیں] │
│                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│  تراویح موڈ          [ON/OFF]   │
│  ڈارک موڈ            [ON/OFF]   │
│  نوٹیفکیشن           [ON/OFF]   │
│                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│  Al-Huda کا وعدہ 🌟             │
│  "ہر آیت — quran.com سے verify │
│   ہر حدیث — sunnah.com سے"     │
│  [مزید جانیں]                  │
│                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│  ورژن ۱.۰.۰                     │
└─────────────────────────────────┘
```

## 21.6.4 Family Dashboard (Web — Parent View)

```
┌─────────────────────────────────────────────────────┐
│  Al-Huda Family Dashboard          Ahmed Household  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│                                                     │
│  ┌──────────────────┐  ┌──────────────────┐        │
│  │ 🌙 حانیہ (۷)    │  │ 📖 بلال (۱۵)    │        │
│  │ NOOR Mode        │  │ FAHM Mode        │        │
│  │                  │  │                  │        │
│  │ آج: یوسف AS ✅  │  │ آج: ۱۲ الفاظ ✅ │        │
│  │ Streak: ۵ 🔥    │  │ جز ۱: ۶۷%       │        │
│  │                  │  │                  │        │
│  │ سیکھے الفاظ:    │  │ حفظ: البقرة ۱-۵ │        │
│  │ صبر، رحمت، نور  │  │                  │        │
│  └──────────────────┘  └──────────────────┘        │
│                                                     │
│  ┌──────────────────┐  ┌──────────────────┐        │
│  │ ☀️ ابو (FAHM)   │  │ ☀️ امی (FAHM)    │        │
│  │ آج: ہدایت ✅    │  │ آج: صبر theme ✅ │        │
│  └──────────────────┘  └──────────────────┘        │
│                                                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│  آج رات ڈنر پر پوچھیں:                             │
│  "حانیہ — یوسف کے کتنے بھائی تھے؟"               │
│  "بلال — آج کس جڑ کے الفاظ سیکھے؟"               │
└─────────────────────────────────────────────────────┘
```

---

# 21.7 NAVIGATION FLOWS — COMPLETE

## 21.7.1 NOOR Complete Navigation Map

```
NOOR HOME
├── Today's Story → Story Player
│   ├── Scene 1..N (auto-advance)
│   ├── Arabic Word (Roshni popup)
│   ├── Ayah Highlight → Reference Sheet
│   ├── Question Screen
│   └── Story Complete → Words Learned
│
├── Word of Day → Root Word Detail
│
├── Stories Library → Story List → Player
│
├── Progress → Chart + Streak + Words
│
└── Profile
    ├── Child name/age edit
    ├── AI Provider (parent)
    └── Parent Dashboard link

PARENT-ONLY SCREENS:
└── Create Personalized Story
    ├── Select Situation
    ├── Loading (generating)
    ├── Preview Story
    └── Play to Child
```

## 21.7.2 FAHM Complete Navigation Map

```
FAHM HOME
├── Continue Reading → Tilawat Screen
│   ├── AyahCard (scroll)
│   │   ├── Tap Arabic word → Breakdown Sheet
│   │   ├── Tap Tafsir → Tafsir Detail
│   │   ├── Tap Reference → External Link
│   │   └── Tap Heart → Journal Entry
│   ├── Depth Selector (floating)
│   └── Audio Player (optional)
│
├── Guidance Mode
│   ├── Text Input
│   ├── Loading
│   ├── Results (ayaat + hadiths)
│   └── Save to Journal
│
├── Learn
│   ├── Root Words Curriculum
│   │   ├── Level 1-4
│   │   └── Word Detail → Ayaat with word
│   └── Hifz Engine
│       ├── Today's Schedule
│       ├── Listen → Repeat → Test
│       └── Progress Chart
│
├── Explore (Knowledge Graph)
│   ├── 10 Dimensions
│   ├── Theme Detail → Ayaat list
│   └── Graph Visualization
│
└── Profile
    ├── Journal
    ├── Life Context Settings
    ├── Reading Progress
    └── Settings
```

## 21.7.3 EXPLORE Complete Navigation Map

```
EXPLORE HOME
├── Personalized Feed
│   ├── Wisdom Card → Full Ayah + Reference
│   ├── Topic Tags → Topic Screen
│   └── Save → Saved Collection
│
├── Search
│   ├── Topic search
│   ├── Results → Ayah/Hadith cards
│   └── Filter by dimension
│
├── Common Questions (FAQ)
│   ├── "What is Jihad?"
│   ├── "Does Islam oppress women?"
│   ├── "Is God the same as Allah?"
│   └── Each → Full answer with refs
│
├── Saved Collection
│   └── All saved wisdom cards
│
└── Settings
    ├── Language preference
    ├── Topics of interest
    └── "Start learning more" → FAHM signup
```

---

# 21.8 MICRO-INTERACTIONS & ANIMATIONS

```
LOADING STATES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Guidance query: Animated Quran icon spinning
               "قرآن میں ڈھونڈ رہے ہیں..."
Story generate: Roshni firefly flying
               "حانیہ کے لیے کہانی بن رہی ہے..."
Graph loading:  Nodes appearing one by one

TRANSITIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Screen change:  Fade (300ms)
Card tap:       Scale down 0.97 → release
Bottom sheet:   Slide up (250ms)
Story scene:    Cross-fade illustration

FEEDBACK:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Save ayah:      Heart fills with animation + haptic
Story complete: Confetti + stars
Right answer:   Stars fly up + haptic
Wrong answer:   Gentle shake (no harsh red flash)
Streak:         Fire emoji grows

ARABIC TEXT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
On screen entry: Fade in from right (RTL natural)
Word tap:        Subtle glow underline
Ayah highlight:  Gold background sweep

ACCESSIBILITY:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
All touch targets: min 48x48dp
Font scaling:      Supports system font size
Contrast ratio:    WCAG AA minimum
Screen reader:     All Arabic text has transliteration
                   as semantic label
```

---

# 21.9 EMPTY STATES

```
No journal entries:
┌───────────────────────────────┐
│  📖                           │
│  ابھی تک کوئی آیت محفوظ نہیں │
│  پڑھتے وقت ❤️ دبائیں        │
└───────────────────────────────┘

No search results:
┌───────────────────────────────┐
│  🔍                           │
│  کوئی نتیجہ نہیں ملا          │
│  دوسرے الفاظ سے تلاش کریں   │
└───────────────────────────────┘

Offline (no connection):
┌───────────────────────────────┐
│  📵                           │
│  انٹرنیٹ نہیں ہے             │
│  تلاوت اور بنیادی تفسیر      │
│  آف لائن دستیاب ہے ✅        │
└───────────────────────────────┘
```

---

# 21.10 ERROR HANDLING

```
Content load error:
→ Retry button
→ "مواد لوڈ نہیں ہو سکا — دوبارہ کوشش کریں"

Story generation error:
→ "کہانی بنانے میں مسئلہ آیا"
→ Retry with same input

Guidance no results:
→ "اس موضوع پر براہ راست آیات نہیں ملیں"
→ Suggest related topics
→ Always show: "کسی عالم سے ملیں"

Invalid AI provider key:
→ "API key غلط ہے"
→ Link to settings
→ Fallback to Al-Huda default
```

---

# 21.11 ONBOARDING PROGRESS INDICATOR

```
All onboarding screens:

○ ━━━ ● ━━━ ○ ━━━ ○
1       2       3       4

Step labels shown
Back button always available
Skip option on non-critical screens
Progress saved if user exits midway
```

---

# 21.12 SHARE CARD DESIGN

```
When user shares any ayah:

┌─────────────────────────────────┐
│                                 │
│         Al-Huda الهدى          │
│                                 │
│   إِنَّ اللَّهَ مَعَ الصَّابِرِينَ  │
│                                 │
│   "بیشک اللہ صبر کرنے          │
│    والوں کے ساتھ ہے"            │
│                                 │
│   📖 البقرة ۲:۱۵۳               │
│   ✅ Verified: quran.com/2:153  │
│                                 │
└─────────────────────────────────┘

Background: Deep Teal with subtle pattern
Font: Amiri for Arabic, Noto Nastaliq for Urdu
Footer: Al-Huda watermark + verification link
Size: 1080x1080 (Instagram) or 1200x630 (Twitter)
```
# AL-HUDA PRD — COMPLETION SECTIONS
## Sections 22-27 — Flutter iOS/Android, Legal, Security, Testing, DevOps, Prayer+Qibla

---

# SECTION 22 — FLUTTER COMPLETE SPECIFICATION

## 22.1 Flutter Platform Decision

```
CONFIRMED: Flutter — Single codebase
Android + iOS from day 1

Rationale:
→ Dawood already knows Flutter (MyDukan production)
→ Arabic RTL support built-in
→ Excellent offline/SQLite support
→ Native performance for audio
→ Single codebase = faster iteration
→ iOS + Android = full Muslim market coverage
```

## 22.2 Flutter Version & Environment

```yaml
# Minimum requirements
flutter: ">=3.16.0"
dart: ">=3.2.0"

# Target platforms
android:
  minSdkVersion: 21        # Android 5.0+ (covers 99% Pakistan)
  targetSdkVersion: 34
  compileSdkVersion: 34

ios:
  minimum_ios_version: "13.0"  # iPhone 6s+ (2015)
  # Covers 95%+ active iOS devices globally
```

## 22.3 Complete pubspec.yaml — Package List

```yaml
name: al_huda
description: The Quran that speaks to you
version: 1.0.0+1

environment:
  sdk: ">=3.2.0 <4.0.0"
  flutter: ">=3.16.0"

dependencies:
  flutter:
    sdk: flutter

  # ── STATE MANAGEMENT ──────────────────────
  flutter_bloc: ^8.1.3          # BLoC pattern
  bloc: ^8.1.2
  equatable: ^2.0.5             # Value equality

  # ── NAVIGATION ────────────────────────────
  go_router: ^13.0.0            # Declarative routing
                                # Handles deep links natively

  # ── LOCAL DATABASE ────────────────────────
  sqflite: ^2.3.2               # SQLite — Quran offline data
  sqflite_sqlcipher: ^2.2.1     # Encrypted SQLite (user journal)
  path_provider: ^2.1.2         # File paths
  hive_flutter: ^1.1.0          # Fast key-value (cache, prefs)

  # ── NETWORK ───────────────────────────────
  dio: ^5.4.0                   # HTTP client
  connectivity_plus: ^5.0.2     # Network status
  cached_network_image: ^3.3.1  # Image caching

  # ── ARABIC / ISLAMIC ──────────────────────
  flutter_qiblah: ^2.0.1        # Qibla direction
  adhan: ^0.1.0                 # Prayer times calculation
                                # (Offline — no API needed)
  arabic_font_flutter: ^0.1.0   # Arabic rendering helpers

  # ── AUDIO ─────────────────────────────────
  just_audio: ^0.9.36           # Audio playback (recitation)
  audio_session: ^0.1.18        # Audio session management
  flutter_tts: ^4.0.2           # Text-to-speech (Dadi Jan voice)

  # ── NOTIFICATIONS ─────────────────────────
  flutter_local_notifications:  # Local notifications
    ^17.0.0
  firebase_messaging: ^14.7.9   # FCM push (Android)
                                # APNs handled via Firebase (iOS)
  firebase_core: ^2.24.2

  # ── UI COMPONENTS ─────────────────────────
  google_fonts: ^6.1.0          # Amiri + Noto Nastaliq + Inter
  flutter_svg: ^2.0.9           # SVG for illustrations
  lottie: ^3.0.0                # Lottie animations (Roshni)
  shimmer: ^3.0.0               # Loading skeletons
  flutter_animate: ^4.5.0       # Page/widget animations
  percent_indicator: ^4.2.3     # Progress bars (hifz)

  # ── CHARTS ────────────────────────────────
  fl_chart: ^0.66.2             # Progress charts

  # ── SHARING ───────────────────────────────
  share_plus: ^7.2.1            # Share ayah cards
  screenshot: ^2.1.0            # Generate share images

  # ── DEVICE FEATURES ───────────────────────
  permission_handler: ^11.1.0   # Runtime permissions
  geolocator: ^11.0.0           # Location (Qibla + prayer times)
  sensors_plus: ^5.0.1          # Compass (Qibla)
  wakelock_plus: ^1.2.0         # Keep screen on (Taraweeh)
  vibration: ^1.8.4             # Haptic feedback

  # ── SECURITY ──────────────────────────────
  flutter_secure_storage: ^9.0.0 # Secure API key storage (BYOK)
  local_auth: ^2.1.7            # Biometric (optional lock)

  # ── IN-APP PURCHASE ───────────────────────
  in_app_purchase: ^3.1.13      # Subscriptions
                                # iOS: StoreKit 2
                                # Android: Google Play Billing

  # ── ANALYTICS ─────────────────────────────
  firebase_analytics: ^10.8.0   # Usage analytics (privacy-safe)
  firebase_crashlytics: ^3.4.9  # Crash reporting

  # ── DEEP LINKING ──────────────────────────
  app_links: ^6.0.0             # Universal links / App links

  # ── UTILITIES ─────────────────────────────
  intl: ^0.19.0                 # Date/number formatting
  hijri: ^2.0.1                 # Hijri calendar
  uuid: ^4.3.3                  # UUID generation
  collection: ^1.18.0           # Collection utilities
  freezed_annotation: ^2.4.1    # Immutable models

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.1
  build_runner: ^2.4.8
  freezed: ^2.4.7               # Code generation
  json_serializable: ^6.7.1     # JSON models
  bloc_test: ^9.1.5             # BLoC unit testing
  mockito: ^5.4.4               # Mocking
  integration_test:
    sdk: flutter
```

## 22.4 State Management — BLoC Architecture

```
WHY BLOC:
→ Dawood familiar with NestJS event-driven patterns
→ BLoC = same concept in Flutter
→ Testable — each event/state unit testable
→ Predictable — no spaghetti state
→ Scales well for complex app

BLOC STRUCTURE:
lib/
├── blocs/
│   ├── auth/
│   │   ├── auth_bloc.dart
│   │   ├── auth_event.dart
│   │   └── auth_state.dart
│   ├── quran/
│   │   ├── quran_bloc.dart
│   │   ├── quran_event.dart
│   │   └── quran_state.dart
│   ├── tilawat/
│   ├── guidance/
│   ├── hifz/
│   ├── noor_story/
│   ├── knowledge_graph/
│   └── prayer/

KEY BLOCS:
QuranBloc       → Ayah loading, translation selection
TilawatBloc     → Reading progress, bookmarks
GuidanceBloc    → Query → RAG → Response
HifzBloc        → Memorization schedule, scoring
NoorStoryBloc   → Story state, progress, audio
PrayerBloc      → Times, notifications, Qibla
AuthBloc        → Login, mode selection, profile
```

## 22.5 Folder Structure

```
lib/
├── main.dart
├── app.dart                    # App entry, GoRouter setup
├── core/
│   ├── constants/
│   │   ├── app_colors.dart
│   │   ├── app_fonts.dart
│   │   └── app_strings.dart    # All UI strings (i18n)
│   ├── theme/
│   │   ├── app_theme.dart
│   │   ├── noor_theme.dart
│   │   ├── fahm_theme.dart
│   │   └── explore_theme.dart
│   ├── router/
│   │   └── app_router.dart     # GoRouter all routes
│   ├── network/
│   │   ├── dio_client.dart
│   │   └── api_endpoints.dart
│   ├── database/
│   │   ├── quran_db.dart       # SQLite offline Quran
│   │   └── secure_db.dart      # SQLCipher journal
│   └── utils/
│       ├── arabic_utils.dart   # Arabic text helpers
│       ├── hijri_utils.dart    # Hijri calendar
│       └── reference_utils.dart # URL builders
├── features/
│   ├── onboarding/
│   ├── noor/                   # Kids mode
│   │   ├── story_player/
│   │   ├── word_discovery/
│   │   └── parent_dashboard/
│   ├── fahm/                   # Muslim mode
│   │   ├── tilawat/
│   │   ├── guidance/
│   │   ├── hifz/
│   │   └── knowledge_graph/
│   ├── explore/                # Non-Muslim mode
│   │   ├── discovery_feed/
│   │   └── misconceptions/
│   ├── prayer/                 # Prayer times + Qibla
│   ├── search/
│   ├── journal/
│   └── settings/
├── data/
│   ├── models/
│   ├── repositories/
│   └── datasources/
│       ├── local/              # SQLite
│       └── remote/             # API calls
└── blocs/
    └── [as above]
```

## 22.6 iOS Specific Requirements

```
APPLE DEVELOPER ACCOUNT:
Cost: $99/year
Enrollment: developer.apple.com
Required before iOS build

INFO.PLIST PERMISSIONS:
NSLocationWhenInUseUsageDescription
  → "Prayer times and Qibla direction"
NSMicrophoneUsageDescription
  → "Quran recitation practice"
NSUserNotificationsUsageDescription
  → "Prayer time reminders and daily ayah"

APP STORE REQUIREMENTS:
Category: Education → Reference
          OR Lifestyle → Religious
Age Rating: 4+ (NOOR mode content)
Privacy Policy URL: required
Support URL: required

APPLE GUIDELINES — ISLAMIC APPS:
→ No App Store rejection history for Islamic apps
→ Must not mock/disrespect any religion
→ In-app purchase must use StoreKit
  (Cannot use JazzCash on iOS — Apple takes 30%)
→ Solution: Web subscription via browser
  "Subscribe on alhuda.app for JazzCash/EasyPaisa"

iOS SUBSCRIPTION WORKAROUND:
→ iOS: StoreKit (Apple 30% cut)
→ Android: Google Play (15-30% cut)
→ Web: JazzCash/EasyPaisa (direct — no cut)
→ Strategy: Promote web subscription in app
  "Save 30% — subscribe on alhuda.app"

APP STORE CONNECT SETUP:
→ Bundle ID: app.alhuda.quran
→ App Name: Al-Huda — القرآن
→ Privacy Manifest: required (iOS 17+)
→ TestFlight: beta testing before launch
```

## 22.7 Push Notifications Architecture

```
SETUP:
Firebase Cloud Messaging (FCM) — Android
Apple Push Notifications (APNs) — iOS
Both managed via Firebase Console

NOTIFICATION TYPES:

1. PRAYER TIME REMINDERS
   Triggered: Locally (adhan package — no server)
   Content: "اذان — فجر کا وقت ہو گیا"
   Channels: Android O+ channel required
   iOS: Time-sensitive notification

2. DAILY AYAH
   Triggered: Server (BullMQ job — 7am user timezone)
   Content: Arabic ayah + Urdu meaning
   Deep link: Opens ayah in app

3. HIFZ REMINDER
   Triggered: Locally (scheduled)
   Content: "آج کا دہرانا یاد ہے؟"
   Deep link: Opens hifz screen

4. STORY NEW EPISODE
   Triggered: Server (when new content added)
   Content: "نئی قسط — حضرت موسیٰ AS"

NOTIFICATION PERMISSIONS:
Android 13+: Runtime permission required
iOS: Always request at onboarding
     Show rationale before request

FLUTTER IMPLEMENTATION:
flutter_local_notifications → prayer (local)
firebase_messaging → server-side (daily ayah, updates)
```

## 22.8 Deep Linking

```
SCHEME: alhuda://

UNIVERSAL LINKS (iOS) / APP LINKS (Android):
Domain: alhuda.app
Config file: /.well-known/apple-app-site-association
             /.well-known/assetlinks.json

SUPPORTED DEEP LINKS:
alhuda://ayah/2/153         → Opens ayah 2:153
alhuda://surah/36           → Opens Surah Ya-Sin
alhuda://story/yusuf/1      → Opens Yusuf story ep 1
alhuda://guidance           → Opens guidance mode
alhuda://theme/sabr         → Opens sabr theme graph
alhuda://hadith/bukhari/1   → Opens hadith

WEB TO APP:
Share cards include deep link
Clicking opens app (if installed)
Falls back to web if not installed

IMPLEMENTATION:
go_router: handles all routes including deep links
app_links: intercepts incoming URLs
```

## 22.9 Offline Data Strategy

```
ON INSTALL — Auto Download (required):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
quran_arabic.db      ~5MB    Arabic text + tashkeel
translations_ur.db   ~3MB    Urdu Jalandhari
tafsir_muyassar.db   ~8MB    Simple tafsir (offline default)
root_words.db        ~2MB    500 roots + meanings
────────────────────────────────────
Total auto: ~18MB (acceptable — user consent shown)

ON DEMAND DOWNLOAD (user choice):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
translations_en.db   ~3MB    English translation
tafsir_ibkathir.db   ~25MB   Ibn Kathir full
audio_{reciter}/     ~150MB  Full recitation
stories_audio/       ~50MB   NOOR stories

DOWNLOAD UI:
"آف لائن استعمال کے لیے ڈاؤن لوڈ کریں"
Progress bar per item
WiFi-only option (default ON)
Pause/Resume support

SYNC STRATEGY:
Local writes first (journal, progress)
Background sync when online
Conflict: local wins (user's personal data)
Server wins: Quran content updates

STORAGE MANAGEMENT:
Settings → Storage → Show sizes
"Clear cache" option (keeps core data)
Low storage warning at <100MB device free
```

## 22.10 App Store Optimization (ASO)

```
GOOGLE PLAY STORE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
App Name (30 chars):
  Al-Huda: قرآن فہم و ہدایت

Short Description (80 chars):
  قرآن سمجھیں، زندگی بدلیں۔ تفسیر، حدیث، بچوں کی کہانیاں

Full Description (4000 chars):
  [Urdu primary, English secondary]
  Key features mentioned
  Scholar endorsements
  "Verified sources" emphasis

Keywords (Play Store tags):
  quran, قرآن, tafsir, تفسیر, hadith, حدیث,
  islamic app, quran urdu, quran translation,
  quran for kids, quran learning, hifz quran,
  islamic education, quran taraweeh

Screenshots (8 required):
  1. Home screen (FAHM mode)
  2. Tilawat with understanding
  3. Guidance mode response
  4. NOOR story player
  5. Knowledge graph
  6. Taraweeh mode
  7. Arabic root words
  8. Family dashboard

Feature Graphic: 1024x500px
  Arabic calligraphy + tagline

APPLE APP STORE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
App Name (30 chars):
  Al-Huda — قرآن و ہدایت

Subtitle (30 chars):
  Quran with Deep Understanding

Keywords (100 chars):
  quran,tafsir,hadith,islamic,prayer,hifz,
  quran urdu,kids quran,quran learning

Screenshots: 6.7" iPhone (required)
             12.9" iPad (recommended)

Privacy labels (required):
  Data collected: Name, email (account)
  Location: Used for prayer times only
  Not sold to third parties
  Not used for tracking
```

---

# SECTION 23 — LEGAL & COMPLIANCE

## 23.1 Privacy Policy Requirements

```
REQUIRED SECTIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Data Collected
   → Account: name, email/phone
   → Usage: reading progress, journal entries
   → Device: OS, app version (for crashes)
   → Location: city-level only (prayer times)
   → NOT collected: precise GPS stored, contacts, 
                    camera, browsing history

2. How Data is Used
   → Personalization (life context)
   → Sync across devices
   → Push notifications
   → Analytics (anonymous, aggregated)
   → NOT: sold, shared with advertisers

3. Data Storage
   → Server: Hetzner (Germany — GDPR-compliant)
   → Encryption: AES-256 at rest
   → Personal data: user can delete anytime

4. Children's Privacy (NOOR mode)
   → Children under 13: no account required
   → Parents create accounts for children
   → No advertising to children
   → COPPA compliant (US)
   → No data shared with third parties

5. User Rights
   → Download your data
   → Delete your account
   → Opt-out of analytics
   → Contact: privacy@alhuda.app

HOST: alhuda.app/privacy
LAST UPDATED: shown in settings
```

## 23.2 Terms of Service

```
KEY TERMS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Islamic Content Disclaimer
   "Al-Huda presents authentic Islamic content
    from verified sources. This app is not a
    substitute for a qualified Islamic scholar
    for specific legal (fiqhi) questions."

2. Content Sources
   "Quran text: Tanzil Project (CC BY 3.0)
    Tafsir: spa5k/tafsir_api (open source)
    Hadith: AhmedBaset/hadith-json + sunnah.com
    All sources cited per content piece."

3. User Content (Journal)
   "Your journal entries are private.
    Al-Huda does not read or share them.
    You retain all rights to your content."

4. Subscription Terms
   → Auto-renewal unless cancelled 24hr before
   → Price shown in local currency
   → No refunds for partial periods
   → Cancel anytime in settings

5. Prohibited Use
   → No scraping content
   → No redistribution of Islamic texts
    without proper attribution
   → No misrepresentation of Islamic teachings

HOST: alhuda.app/terms
```

## 23.3 Open Source License Obligations

```
DEPENDENCIES WE MUST CREDIT:

tanzil.net
  License: CC BY 3.0
  Required: Credit in app + link to tanzil.net
  Where: Settings → About → Sources

fawazahmed0/quran-api
  License: Open (maintainer's terms)
  Required: Attribution
  Where: Settings → About → Sources

spa5k/tafsir_api
  License: MIT
  Required: MIT notice
  Where: Open source credits page

AhmedBaset/hadith-json
  License: MIT
  Required: MIT notice

mustafa0x/quran-morphology
  License: (GPL inherited from corpus.quran.com)
  Required: GPL notice, source code available
  Action: Host GPL-covered code on GitHub

sunnah.com
  License: Content usage per their terms
  Required: Link back to sunnah.com per hadith
  Where: ReferenceBar (already in PRD ✅)

LiteLLM (BerriAI)
  License: MIT
  Required: MIT notice

Graphify (safishamsi)
  License: MIT

Graphiti (getzep)
  License: MIT

ALL CREDITS PAGE:
Settings → About → Open Source Licenses
Standard Flutter licenses page +
Islamic content sources list
```

## 23.4 Pakistan Data Protection

```
PAKISTAN PDPA (Personal Data Protection Act):
→ Act passed 2023, implementing regulations pending
→ Best practice: GDPR-level compliance
→ Data localization: Not mandated yet
→ Hetzner Germany = safe jurisdiction

PRACTICAL STEPS:
→ Privacy policy in Urdu + English
→ Consent at onboarding (clear checkboxes)
→ Data deletion request within 30 days
→ No sale of personal data (ever)
→ Breach notification policy (72 hours)
```

## 23.5 Islamic Content Copyright

```
QURAN TEXT:
→ Quran itself is not copyrightable
→ Specific typesetting/fonts may be
→ Tanzil text: CC BY 3.0 — safe to use

TRANSLATIONS:
→ Public domain (100+ years): Jalandhari, Pickthall
→ Modern translations: Check individual licenses
→ Tanzil provides verified permissions
→ King Fahd Complex: Free for non-commercial, free apps

TAFSIR CONTENT:
→ Classical scholars (Ibn Kathir, Tabari): Public domain
→ spa5k API: Uses content from quran.com — check ToS
→ Modern scholars (Dr. Israr): May have copyright
→ Safe approach: Classical tafsir primary, modern secondary

HADITH:
→ Hadith text itself: Public domain
→ Specific translations: Check
→ sunnah.com: Free to use with attribution

ACTION ITEMS:
□ Get written permission from spa5k maintainer
□ Verify King Fahd Complex terms for app use
□ Check sunnah.com terms for commercial app use
□ Add all attributions to About page
```

---

# SECTION 24 — SECURITY ARCHITECTURE

## 24.1 Authentication Security

```
PHONE OTP (Pakistan primary):
→ Twilio Verify or Firebase Phone Auth
→ OTP expires: 10 minutes
→ Max attempts: 5 (then 30min lockout)
→ Rate limit: 3 OTPs per hour per phone

JWT TOKENS:
→ Access token: 15 minutes expiry
→ Refresh token: 30 days
→ Stored: flutter_secure_storage (iOS Keychain, Android Keystore)
→ NEVER stored in SharedPreferences or Hive unencrypted

GOOGLE OAUTH:
→ google_sign_in package
→ Server-side token verification
→ No password stored

SESSION MANAGEMENT:
→ Logout: Invalidate refresh token server-side
→ Multiple devices: Allowed (family accounts)
→ Force logout: Admin can revoke (scholar accounts)
```

## 24.2 API Security

```
ALL ENDPOINTS:
→ HTTPS only (TLS 1.3 minimum)
→ JWT Bearer token required (except public Quran)
→ Cloudflare: DDoS protection, WAF

RATE LIMITING (per user):
→ Guidance queries: 10/minute, 100/day (free), unlimited (pro)
→ Story generation: 5/day (free), 50/day (pro)
→ General API: 1000 requests/minute

BYOK API KEYS:
→ User's provider key stored in flutter_secure_storage
→ NEVER sent to Al-Huda servers
→ Passed directly to LiteLLM from device
→ Server never sees user's OpenAI/Gemini key

INPUT VALIDATION:
→ Guidance query: max 500 chars
→ Journal entry: max 2000 chars
→ XSS prevention: sanitize all text inputs
→ SQL injection: Prisma ORM parameterized queries only

ISLAMIC CONTENT INTEGRITY:
→ Quran text: SHA-256 hash verified on load
   Any tampering → re-download from tanzil.net
→ Tafsir: Version-pinned CDN URLs (spa5k @main pinned to commit)
→ Hadith: Grade stored, never modified
```

## 24.3 User Data Encryption

```
AT REST:
→ User journal: SQLCipher AES-256 (local)
→ Server DB: Hetzner encrypted volumes
→ Backups: Encrypted

IN TRANSIT:
→ All API: HTTPS/TLS 1.3
→ WebSocket (if used): WSS

SENSITIVE DATA:
→ Phone numbers: Hashed before storage (SHA-256 + salt)
→ Email: Stored, not hashed (needed for contact)
→ Journal entries: User-owned, not indexed by Al-Huda
→ Life context: Stored, used for personalization only

CHILDREN DATA (NOOR):
→ No direct child accounts
→ Parent account owns child profile
→ Child data: name + age + progress only
→ No contact info for children stored
→ Separate SQLCipher key per child profile
```

## 24.4 Permissions Strategy

```
ANDROID PERMISSIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INTERNET                    → Always (API calls)
ACCESS_NETWORK_STATE        → Network check
RECEIVE_BOOT_COMPLETED      → Reschedule prayer notifications
POST_NOTIFICATIONS          → Push notifications (Android 13+)
ACCESS_COARSE_LOCATION      → Prayer times + Qibla
RECORD_AUDIO                → Hifz practice (mic)
VIBRATE                     → Haptic feedback
FOREGROUND_SERVICE          → Audio playback background
WAKE_LOCK                   → Taraweeh screen-on

iOS PERMISSIONS (Info.plist):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NSLocationWhenInUseUsageDescription
  → "Al-Huda uses location for accurate prayer times
     and Qibla direction. Location is never stored."
NSMicrophoneUsageDescription
  → "Al-Huda uses microphone for Quran recitation
     practice in Hifz mode."
NSUserNotificationsUsageDescription
  → "Al-Huda sends prayer time reminders and
     your daily Quranic insight."

PERMISSION REQUEST TIMING:
→ Location: Only when user opens Prayer Times
→ Microphone: Only when user starts Hifz practice
→ Notifications: At onboarding step 3 (with rationale)
→ Never request all at once
→ If denied: Show settings redirect with explanation
```

---

# SECTION 25 — PRAYER TIMES & QIBLA

## 25.1 Why This Must Be Included

```
Islam360 has this. Muslim Pro built on this.
Every serious Islamic app has it.

Without prayer times:
→ User opens Islam360 for prayer times
→ Never comes back to Al-Huda
→ Islam360 wins daily active user

With prayer times:
→ Al-Huda = daily utility
→ 5 times a day touchpoint
→ Natural moment to show daily ayah
→ Retention dramatically improves
```

## 25.2 Prayer Times — Technical

```
LIBRARY: adhan (Dart port of Adhan.js)
→ Offline calculation — no API needed
→ Multiple calculation methods:
  - University of Islamic Sciences, Karachi (Pakistan default)
  - Muslim World League (global)
  - Egyptian General Authority (Egypt)
  - ISNA (North America)
  - MWL (Europe)
→ Madhab: Hanafi / Shafi (user selects)
→ Asr calculation: Hanafi default (Pakistan)

CALCULATION INPUT:
→ Coordinates (lat/long from device)
→ Date
→ Timezone

OUTPUT:
→ Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha
→ Optional: Tahajjud, Ishraq

LOCATION:
→ Auto-detect (geolocator — one time, cached)
→ Manual city selection (fallback)
→ City database: offline JSON (~500 major cities)
→ Pakistan cities: complete list
```

## 25.3 Prayer Times — UI

```
PRAYER TIMES WIDGET (Home screen):

┌─────────────────────────────────┐
│  🕌 آج کی نمازیں — لاہور       │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│  فجر     ۵:۱۲ ص    ✅ ادا       │
│  ظہر     ۱:۰۴ ظ    ⏰ ۲ گھنٹے   │  ← Next prayer
│  عصر     ۴:۳۲ ع              │
│  مغرب    ۶:۴۷ ع              │
│  عشا     ۸:۱۲ ع              │
│                                 │
│  قبلہ: ↗ 258°   [دیکھیں]      │
└─────────────────────────────────┘

FULL PRAYER SCREEN:
┌─────────────────────────────────┐
│  ←  نماز کے اوقات              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│  📍 لاہور، پنجاب               │
│  ۱۵ رمضان ۱۴۴۶ / ۱۵ مارچ ۲۵  │
│                                 │
│  ┌─────────────┬───────────┐   │
│  │  🌙 فجر    │  ۵:۱۲ ص  │   │
│  │  🌅 طلوع   │  ۶:۳۲ ص  │   │
│  │  ☀️ ظہر    │  ۱:۰۴ ظ  │   │  ← Current
│  │  🌤 عصر    │  ۴:۳۲ ع  │   │
│  │  🌇 مغرب   │  ۶:۴۷ ع  │   │
│  │  🌙 عشا    │  ۸:۱۲ ع  │   │
│  └─────────────┴───────────┘   │
│                                 │
│  حساب کا طریقہ: کراچی یونیورسٹی │
│  مسلک: حنفی                    │
│  [تبدیل کریں]                  │
│                                 │
│  اذان اطلاعات:                  │
│  [فجر ✅] [ظہر ✅] [عصر ✅]    │
│  [مغرب ✅] [عشا ✅]             │
└─────────────────────────────────┘
```

## 25.4 Adhan Notifications

```
NOTIFICATION CONTENT:
Fajr: "🌙 فجر کا وقت — ۵:۱۲"
      + Quran ayah about Fajr prayer

Dhuhr: "☀️ ظہر کا وقت — ۱:۰۴"
Asr: "🌤 عصر کا وقت — ۴:۳۲"
Maghrib: "🌇 مغرب کا وقت — ۶:۴۷"
Isha: "🌙 عشا کا وقت — ۸:۱۲"

SOUND OPTIONS:
→ Adhan Mishary Rashid (default)
→ Adhan Makkah
→ Silent (notification only)
→ Custom ringtone

NOTIFICATION SCHEDULING:
→ adhan package calculates times
→ flutter_local_notifications schedules
→ Recalculated daily (times change daily)
→ Works offline (local calculation)
→ Background service for reliability
```

## 25.5 Qibla Direction

```
LIBRARY: flutter_qiblah
→ Uses device compass + GPS
→ Real-time bearing to Makkah
→ Accuracy: ±2 degrees

UI:
┌─────────────────────────────────┐
│  ←  قبلہ                       │
│                                 │
│         ┌─────────┐            │
│         │    N    │            │
│         │  ↑      │            │
│         │ [●]     │            │
│         │  ↗ 258° │            │
│         │    S    │            │
│         └─────────┘            │
│                                 │
│   قبلہ کی سمت: 258°            │
│   آپ کی سمت: 260°              │
│   فرق: 2° — ✅ درست             │
│                                 │
│  📍 لاہور سے مکہ: ۴,۵۰۰ کلومیٹر│
└─────────────────────────────────┘

Calibration prompt if compass unreliable:
"کمپاس کو کیالیبریٹ کریں — فون کو 8 کی شکل میں گھمائیں"
```

---

# SECTION 26 — TESTING STRATEGY

## 26.1 Unit Tests

```
COVERAGE TARGET: 80% minimum

WHAT TO TEST:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLoC Tests:
→ Each event → expected state
→ GuidanceBloc: query → loading → result/error
→ HifzBloc: review → score update → next schedule
→ PrayerBloc: location → correct times

Repository Tests:
→ Quran DB reads correct ayah
→ Translation switching works
→ Offline fallback works

Utils Tests:
→ Arabic reference URL generation
→ Hijri date conversion
→ Prayer time calculation (known values)
→ Sunnah.com URL builder

EXAMPLE:
test('GuidanceBloc emits results for valid query', () async {
  final bloc = GuidanceBloc(repository: mockRepository);
  
  when(mockRepository.getGuidance('business ethics'))
    .thenAnswer((_) async => [mockAyah1, mockAyah2]);
  
  bloc.add(GuidanceQuerySubmitted('business ethics'));
  
  await expectLater(
    bloc.stream,
    emitsInOrder([
      GuidanceLoading(),
      GuidanceLoaded(ayaat: [mockAyah1, mockAyah2]),
    ]),
  );
});
```

## 26.2 Widget Tests

```
WHAT TO TEST:
→ AyahCard renders Arabic text correctly
→ ReferenceBar shows correct URL
→ Story player controls work
→ Guidance input submits query
→ RTL layout correct for Arabic screens
→ Prayer times display format

ARABIC RENDERING TEST:
testWidgets('Arabic text renders RTL', (tester) async {
  await tester.pumpWidget(
    MaterialApp(
      home: AyahCard(
        ayah: testAyah,
        locale: Locale('ar'),
      ),
    ),
  );
  
  final textWidget = tester.widget<Text>(
    find.text('بِسْمِ اللَّهِ')
  );
  
  expect(textWidget.textDirection, TextDirection.rtl);
});
```

## 26.3 Integration Tests

```
KEY FLOWS TO TEST:
→ Complete NOOR onboarding → story plays
→ FAHM: tap ayah → tafsir opens → reference link works
→ Guidance: type query → response shown → save to journal
→ Offline: disable network → tilawat still works
→ Purchase: subscription flow (sandbox)
→ Notification: prayer time fires correctly
→ Deep link: alhuda://ayah/2/153 opens correct screen

DEVICE MATRIX:
→ Android: Samsung Galaxy A-series (most common Pakistan)
→ Android: Low-end device (2GB RAM, Android 8)
→ iOS: iPhone 12 (common mid-range)
→ iOS: iPhone SE (small screen)
→ Tablet: iPad (for web dashboard)
```

## 26.4 Performance Benchmarks

```
TARGETS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
App cold start:          < 3 seconds
App warm start:          < 1 second
Ayah load (offline):     < 100ms
Guidance query response: < 5 seconds
Story audio start:       < 2 seconds
Knowledge graph render:  < 3 seconds
Scroll performance:      60fps (no jank)

ARABIC TEXT PERFORMANCE:
→ Arabic fonts preloaded on install
→ No font download delay during reading
→ Cached rendered text for common ayaat

MEMORY:
→ Max RAM: 150MB normal use
→ Max RAM: 250MB during story (audio + illustrations)
→ No memory leaks in BLoC streams
```

---

# SECTION 27 — DEVOPS & CI/CD

## 27.1 Environments

```
THREE ENVIRONMENTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DEV:
  API: https://api-dev.alhuda.app
  DB: Local / Coolify dev instance
  Firebase: Dev project
  Flutter: --dart-define=ENV=dev

STAGING:
  API: https://api-staging.alhuda.app
  DB: Staging on Hetzner
  Firebase: Staging project
  TestFlight + Internal Play Track

PRODUCTION:
  API: https://api.alhuda.app
  DB: Production on Hetzner
  Firebase: Production project
  App Store + Play Store public
```

## 27.2 CI/CD Pipeline

```
GITHUB ACTIONS WORKFLOW:

On PR → develop:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
→ Flutter analyze (linting)
→ Flutter test (unit + widget)
→ Build APK (debug)
→ Post results to PR

On merge → develop:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
→ All above +
→ Integration tests (Firebase Test Lab)
→ Build staging APK + IPA
→ Deploy to Firebase App Distribution (team testing)

On merge → main (release):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
→ All above +
→ Build production APK + IPA (signed)
→ Deploy API to Coolify (Hetzner)
→ Upload to Play Store (internal → beta → production)
→ Upload to TestFlight → App Store review
→ Tag release on GitHub

COOLIFY DEPLOYMENT:
→ NestJS API: Docker container
→ Auto-deploy on main merge
→ Zero-downtime: Blue-green deployment
→ Rollback: One-click in Coolify dashboard
```

## 27.3 Flutter Build & Signing

```
ANDROID SIGNING:
→ Keystore: Generated once, stored securely
→ GitHub Secret: KEYSTORE_FILE (base64)
→ GitHub Secret: KEY_ALIAS, KEY_PASSWORD
→ Build: flutter build apk --release
         flutter build appbundle --release (Play Store)

iOS SIGNING:
→ Certificate: Apple Distribution Certificate
→ Provisioning Profile: App Store distribution
→ Match (Fastlane): Team certificate management
→ Build: flutter build ios --release
         xcodebuild archive → IPA

VERSIONING:
→ pubspec.yaml: version: 1.0.0+1
  Format: MAJOR.MINOR.PATCH+BUILD_NUMBER
→ Auto-increment BUILD_NUMBER in CI
→ Semantic versioning for features

BUILD FLAVORS:
→ dev: Debug API, Firebase dev, no signing
→ staging: Staging API, Firebase staging, debug signing
→ production: Prod API, Firebase prod, release signing
```

## 27.4 Monitoring & Alerting

```
CRASH REPORTING:
→ Firebase Crashlytics (both platforms)
→ Alert: Email when crash rate > 1%
→ PII stripped before sending

PERFORMANCE:
→ Firebase Performance Monitoring
→ Track: App start time, network requests, screen renders
→ Alert: Response time > 10s

SERVER:
→ Coolify built-in monitoring
→ Alert: CPU > 80%, Memory > 85%
→ Uptime check: every 5 minutes

ANALYTICS (Privacy-respecting):
TRACK:
→ Mode selected at onboarding
→ Feature used (tilawat/guidance/hifz)
→ Daily active usage minutes
→ Story completion rate
→ Subscription conversion

DO NOT TRACK:
→ Specific queries (guidance text)
→ Journal entries
→ Specific ayaat read
→ Personal life context content

TOOL: Firebase Analytics
→ No Mixpanel, no Amplitude, no third-party
→ Google Firebase = acceptable privacy profile
→ Data: anonymized, aggregated only
```

## 27.5 Database Backups

```
MYSQL (Production):
→ Daily automated backup (Coolify)
→ Retained: 30 days
→ Location: Hetzner Volume (encrypted)
→ Weekly backup to S3-compatible storage
→ Restore test: Monthly

NEO4J:
→ Daily dump
→ Retained: 7 days
→ Knowledge graph rebuild possible from scratch

USER DATA:
→ Continuous replication
→ Point-in-time recovery: 7 days
→ GDPR: Delete within 30 days of request
```

---

# SECTION 28 — ACCESSIBILITY & LOCALIZATION

## 28.1 Accessibility

```
WCAG 2.1 AA COMPLIANCE:

TEXT:
→ Minimum font size: 14sp
→ System font scaling: Supported (intl package)
→ Arabic: Amiri supports all Unicode Arabic
→ Contrast ratio: 4.5:1 minimum

SCREEN READER SUPPORT:
→ All Arabic text: semantic label = transliteration
  Example: "بِسْمِ اللَّهِ" → label: "Bismillah ir-rahman ir-rahim"
→ Images: descriptive alt text
→ Story illustrations: described for visually impaired
→ Android: TalkBack tested
→ iOS: VoiceOver tested

TOUCH TARGETS:
→ Minimum: 48x48dp (all buttons)
→ Prayer times: large tap areas
→ Story player controls: 56x56dp

MOTOR IMPAIRMENT:
→ No timed interactions (except story auto-advance = skippable)
→ All gestures have tap alternatives
→ Swipe to advance story: also "Next" button

COLOR BLINDNESS:
→ Grade badges: Shape + color (not color only)
  Sahih: ✅ green checkmark
  Hasan: 🟡 yellow circle
  Da'if: ⚠️ warning triangle
→ No information conveyed by color alone
```

## 28.2 Localization (i18n)

```
SUPPORTED LANGUAGES (UI):
Primary:   Urdu (ur) — RTL
Secondary: English (en) — LTR
Planned:   Arabic (ar) — RTL, Bengali (bn), Hindi (hi)

FLUTTER L10N SETUP:
flutter_localizations (built-in)
intl package

FILE STRUCTURE:
lib/l10n/
  app_ur.arb   # Urdu strings
  app_en.arb   # English strings

EXAMPLE app_ur.arb:
{
  "homeGreeting": "السَّلاَمُ عَلَيْكُمْ",
  "continueReading": "جاری رکھیں",
  "guidanceHint": "اپنی بات لکھیں...",
  "verifyLabel": "تصدیق کریں"
}

RTL/LTR HANDLING:
→ All layouts: Directionality widget or
  locale-aware padding (start/end not left/right)
→ Arabic content: Always RTL regardless of UI language
→ English content in Urdu UI: LTR embedded

DATE/TIME FORMATTING:
→ Hijri calendar: hijri package
→ Display: Both Hijri + Gregorian
  "۱۵ رمضان ۱۴۴۶ / ۱۵ مارچ ۲۰۲۵"
→ Time: 12-hour (Pakistan default), 24-hour option
→ Prayer times: Always 12-hour in Urdu

NUMBER FORMATTING:
→ Urdu UI: ١٢٣٤ (Eastern Arabic numerals) OR
           1234 (user preference)
→ Ayah numbers: ٢:١٥٣ or 2:153
→ Setting: Number format preference
```

---

# SECTION 29 — ANALYTICS & CONTENT OPERATIONS

## 29.1 Scholar Review Portal

```
WEB PORTAL: scholars.alhuda.app

FEATURES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Review Queue:
→ AI-generated tafsir summaries pending approval
→ Theme connections (INFERRED from Graphify)
→ User-flagged content
→ New story scripts

Per Review Item:
→ Content shown (Arabic + AI summary)
→ Source reference shown
→ Scholar approves / rejects / edits
→ Version history maintained
→ Reason required for rejection

Dashboard:
→ Pending queue count
→ Approved this week
→ Flagged by users (priority queue)

SCHOLAR ACCOUNTS:
→ Invited only
→ 2FA required
→ Activity log (audit trail)
→ Per-scholar approval history
→ Multiple scholars can review same content
  Consensus required for publication (2/3)
```

## 29.2 Content Operations Dashboard

```
INTERNAL DASHBOARD: admin.alhuda.app

QURAN CONTENT:
→ 6,236 ayaat — tafsir completion %
→ Scholar approval status per ayah
→ Missing sabab nuzool entries
→ Translation quality flags

STORIES (NOOR):
→ Episodes published / pending
→ Audio production status
→ Illustration status
→ Scholar approval

USER METRICS:
→ DAU/MAU per mode
→ Feature usage heatmap
→ Guidance query topics (anonymized)
→ Story completion rates
→ Hifz progress aggregate

CONTENT FLAGS:
→ User-reported incorrect content
→ Auto-queue for scholar review
→ Resolution time tracking

TECHNICAL:
→ API health
→ DB performance
→ CDN hit rate (tafsir API)
→ Offline download stats
```

---

# SECTION 30 — FLUTTER iOS ADDITIONAL SPECS

## 30.1 iOS-Specific UI Adaptations

```
SAFE AREA HANDLING:
→ All screens: SafeArea widget
→ Bottom navigation: padding for home indicator
→ Notch: handled automatically by Flutter

iOS DESIGN GUIDELINES:
→ Navigation: CupertinoNavigationBar option
   (or Material — consistent with Android)
   Decision: Material Design (consistent branding)
→ Dialogs: CupertinoAlertDialog on iOS
→ Date picker: CupertinoDatePicker for prayer settings
→ Action sheets: CupertinoActionSheet for options

HAPTICS:
→ iOS: HapticFeedback.lightImpact() for taps
→ Android: VibrationEffect.createOneShot()
→ Taraweeh: No haptics (respect prayer)
→ Story complete: HapticFeedback.heavyImpact()

DYNAMIC TYPE (iOS font scaling):
→ Flutter respects iOS Dynamic Type automatically
→ Test at all accessibility sizes
→ Arabic text: verify Amiri scales correctly

FACE ID / TOUCH ID (Optional):
→ local_auth package
→ Optional journal lock feature
→ "Apna journal محفوظ رکھیں — biometric lock لگائیں"
```

## 30.2 App Store Review Preparation

```
REVIEW NOTES (submit with app):
"Al-Huda is an Islamic education app that:
 1. Provides Quran with verified translations
 2. Islamic stories for children (NOOR mode)
 3. Guided Islamic learning for adults
 4. Authentic source citations for all content
 
 Test account:
 Phone: +92-300-1234567
 OTP: 123456 (sandbox mode)
 
 NOOR mode: Select 'مرا بچہ' on onboarding
 FAHM mode: Select 'میں مسلمان ہوں'
 EXPLORE mode: Select 'جاننا چاہتا ہوں'"

COMMON REJECTION REASONS & SOLUTIONS:
→ Metadata: Ensure no "best" or "#1" claims
→ Privacy: Complete privacy manifest required (iOS 17+)
→ In-app purchase: StoreKit required for subscriptions
→ Account deletion: Must be in-app (Settings → Delete Account)
→ Sign in with Apple: Required if social login offered
  → Add Sign in with Apple alongside Google OAuth
```

## 30.3 Sign in with Apple (Required for iOS)

```
Apple REQUIRES Sign in with Apple if you offer
any other social login (Google OAuth).

IMPLEMENTATION:
→ sign_in_with_apple package
→ Server-side verification of Apple identity token
→ Handle email relay (Apple hides real email)
→ Store: apple_user_id (stable identifier)

UI:
→ Show "Sign in with Apple" button
→ Minimum button size: 44pt height
→ Use Apple's official button design
→ Show BEFORE Google option on iOS
```
