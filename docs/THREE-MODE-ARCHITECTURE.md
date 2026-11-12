# Three-Mode Product Architecture Specification

**Document Status:** Draft — Pending Stakeholder Review  
**Date:** November 11, 2026  
**Baseline:** PRD v4.1 / Sprint 54  
**Decision Reference:** STAKEHOLDER-DECISION-2026-11-11.md  
**Purpose:** Define the foundational architecture for NOOR, FAHM, and EXPLORE modes

---

## Executive Summary

This document specifies the three-mode product architecture approved on November 11, 2026 (D-01 through D-08). The architecture restores the original PRD v2.0 vision while retaining the current Next.js web-first technical foundation.

**Key Principles:**
- Three distinct audience experiences (NOOR, FAHM, EXPLORE)
- One shared Quran and reference foundation
- Mode-specific presentation layers
- Shared data integrity and editorial governance
- No framework migration (Next.js retained)

**Authorization Status:** This is a specification for stakeholder review, not an implementation authorization.

---

## 1. Product Vision

### 1.1 Three Modes, One Product

Al-Huda serves three distinct audiences through three dedicated experiences:

| Mode | Audience | Primary Purpose | Age Range |
|------|----------|-----------------|-----------|
| **NOOR** (نور) | Children | Age-appropriate Quran learning through discovery | 3-12 (TBD) |
| **FAHM** (فهم) | Muslims | Deep Quran study, understanding, and personal learning | 13+ |
| **EXPLORE** (کشف) | Seekers and curious visitors | Pressure-free Quran discovery | All ages |

### 1.2 Mode Boundaries

Each mode has a distinct purpose and audience. They are not interchangeable or redundant:

- **NOOR** is not a simplified FAHM. It requires its own interaction model, language, content presentation, and age-appropriate learning progression.
- **FAHM** is the continuation of the current product. It builds on existing functionality rather than rebuilding.
- **EXPLORE** is not a stripped-down FAHM. It is designed from the ground up for newcomers who may not understand Islamic terminology, Arabic, or traditional study methods.

### 1.3 Shared Foundation

All three modes share:
- Quran text (immutable)
- Translation editions and attribution
- Tafsir resources and attribution
- Arabic word and morphology references
- Root and lemma data
- Curated topic and dimension references
- Content provenance and editorial status
- Search and Quran navigation capabilities
- Accessibility and localization foundations

**Critical Constraint:** A mode may decide how to present a resource. It must not silently modify the underlying source or its scholarly attribution.

---

## 2. Technical Architecture

### 2.1 Technology Stack (Approved — D-02)

- **Framework:** Next.js 15.3.8 App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Context + localStorage for personal data
- **Data Storage:** Local-first (localStorage for bookmarks, notes, collections, journey progress)
- **Accounts:** None (account-free usage — D-09)
- **Cloud Sync:** None (not authorized)
- **AI Integration:** None (AI religious answers disabled — D-10)

### 2.2 Logical Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │   NOOR   │  │   FAHM   │  │ EXPLORE  │                 │
│  │  (Child) │  │ (Muslim) │  │ (Seeker) │                 │
│  └──────────┘  └──────────┘  └──────────┘                 │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Mode-Specific Logic                        │
│  - Mode-specific UI components                              │
│  - Mode-specific content presentation                       │
│  - Mode-specific navigation                                 │
│  - Mode-specific user preferences                           │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                 Shared Domain Layer                          │
│  - Topic services                                           │
│  - Journey services                                         │
│  - Dimension services                                       │
│  - Domain services                                          │
│  - Search services                                          │
│  - Navigation services                                      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Shared Reference & Provenance Layer             │
│  - Quran text and canonical references                      │
│  - Translation editions and attribution                     │
│  - Tafsir resources and attribution                         │
│  - Arabic word and morphology references                    │
│  - Root and lemma data                                      │
│  - Content provenance and editorial status                  │
└─────────────────────────────────────────────────────────────┘
```

### 2.3 Directory Structure (Proposed)

```
src/
├── app/
│   ├── (noor)/              # NOOR mode routes
│   │   ├── learn/
│   │   ├── stories/
│   │   ├── activities/
│   │   └── parent/
│   ├── (fahm)/              # FAHM mode routes (current product)
│   │   ├── quran/
│   │   ├── topics/
│   │   ├── journeys/
│   │   ├── roots/
│   │   └── my-study/
│   ├── (explore)/           # EXPLORE mode routes
│   │   ├── discover/
│   │   ├── questions/
│   │   ├── topics/
│   │   └── paths/
│   └── shared/              # Shared routes (mode selector, etc.)
├── components/
│   ├── noor/                # NOOR-specific components
│   ├── fahm/                # FAHM-specific components (current)
│   ├── explore/             # EXPLORE-specific components
│   └── shared/              # Shared components
├── lib/
│   ├── quran/               # Shared Quran data layer
│   ├── translations/        # Shared translation layer
│   ├── tafsir/              # Shared Tafsir layer
│   ├── morphology/          # Shared morphology layer
│   ├── topics/              # Shared topic services
│   ├── study-journeys/      # Shared journey services
│   ├── explore/             # Shared dimension services
│   ├── taxonomy/            # Shared domain services
│   └── modes/               # Mode management (selection, switching, preferences)
└── data/                    # Shared data files (JSON)
```

### 2.4 Mode Management

#### Mode Selection
- Users select a mode during onboarding or via a mode selector in navigation
- Mode preference stored in localStorage: `alhuda.selected-mode.v1`
- Mode can be changed at any time (not a permanent identity label)
- Default mode: FAHM (current product behavior)

#### Mode Context
- Each mode has its own React context provider
- Mode context includes:
  - Current mode identifier
  - Mode-specific preferences
  - Mode-specific UI state
- Shared data accessed through shared services, not mode context

#### Mode Switching
- Mode switching preserves user's position where possible
- Example: If user is reading Surah Al-Fatihah in FAHM and switches to EXPLORE, they remain on Surah Al-Fatihah
- Mode switching does not clear personal data (bookmarks, notes, etc.)
- Mode switching is instantaneous (no page reload required)

---

## 3. Mode Specifications

### 3.1 NOOR Mode (Children)

**Status:** Specification pending (blocked by D-07 — child-safety specification required)

**Intended Scope:**
- Age-appropriate onboarding
- Parent-assisted entry and setup
- Child-friendly Quran learning
- Stories and guided lessons
- Arabic vocabulary discovery
- Audio-supported learning
- Interactive exercises and games
- Progress tracking (non-pressuring)
- Parent-facing progress and controls

**Critical Dependencies:**
- Child-safety and privacy specification (D-07) — hard prerequisite
- Age range decision (Q-7)
- Parental controls decision (Q-7)
- Parent-mediated entry decision (Q-1)

**Design Principles:**
- NOOR must not inherit adult-oriented social, journal, or personalization features by default
- Content must be age-appropriate and reviewed by child development experts
- No external links without parental approval
- No social features without explicit approval
- Data collection minimized to what is necessary for learning progression

**Technical Considerations:**
- Separate component library for child-friendly UI
- Audio playback support for stories and lessons
- Parental dashboard (separate from child interface)
- Progress tracking without gamification pressure
- Accessibility for young users (large touch targets, simple navigation)

---

### 3.2 FAHM Mode (Muslims)

**Status:** Current product (D-04 approved)

**Intended Scope:**
- Quran reading and Tilawat
- Translation selection
- Tafsir and contextual study
- Word-by-word analysis
- Root and morphology exploration
- Curated topics and life dimensions
- Study Journeys
- Bookmarks, notes, and collections
- Hifz and revision experiences (future — Q-5)
- Personal reflection and study history
- Namaz companion (future — Q-5)

**Current Implementation:**
- 18 curated topics (all pending scholarly review)
- 15 life dimensions (editorial navigation aids)
- 14 domains (organizational proposal)
- 4 study journeys with 20 stages
- Word-by-word study
- Root discovery and morphology
- Personal study tools (bookmarks, notes, collections)
- Local progress tracking

**Design Principles:**
- Build on existing functionality (D-04)
- Preserve all existing study tools (Q-4 recommendation)
- Maintain data integrity and editorial governance
- Support deep study and personal reflection
- Provide structured learning paths (Study Journeys)

**Technical Considerations:**
- Current Next.js architecture is the FAHM baseline
- No rebuild required — incremental improvements only
- All existing features retained
- Future features (Hifz, Namaz, journal, knowledge graph) deferred until user feedback received (Q-5)

---

### 3.3 EXPLORE Mode (Seekers)

**Status:** Specification pending (D-08 approved)

**Intended Scope:**
- Beginner-friendly Quran discovery
- Topic-based entry points
- Common questions and misconceptions
- Contextual Quran exploration
- Clear explanations of unfamiliar terms
- Reading paths for people unfamiliar with Islam
- Respectful comparative context (where properly sourced)
- Clear distinction between Quranic text, translation, Tafsir, and editorial explanation
- No conversion pressure or manipulative onboarding

**Design Principles:**
- EXPLORE is not a stripped-down FAHM (D-08)
- Designed from the ground up for newcomers
- Avoid overwhelming seekers with Islamic terminology
- Provide context and explanations for unfamiliar concepts
- Respectful tone — no conversion pressure
- Clear boundaries between source text and editorial explanation

**Content Standards:**
- All content must be beginner-friendly (see EXPLORE-CONTENT-STANDARDS.md)
- Terms must be explained on first use
- Comparative context must be properly sourced and respectful
- No assertion of religious authority
- Clear labeling of Quranic text vs. translation vs. commentary

**Technical Considerations:**
- Separate component library for seeker-friendly UI
- Glossary system for Islamic terms
- Contextual help and explanations
- Reading path system (guided exploration)
- Search optimized for beginner queries

---

## 4. Shared Foundation

### 4.1 Quran Text and Canonical References

**Immutability:** Quran text is immutable through ordinary product features. No mode may modify the Quran text.

**Attribution:** All Quran text must carry proper attribution to the canonical source (Uthmani script, Hafs transmission).

**Access:** All modes access the same Quran text through shared services. No duplication.

### 4.2 Translations and Tafsir

**Attribution:** All translations and Tafsir must carry proper attribution to their sources.

**Selection:** Users may select translation editions (FAHM) or be presented with beginner-friendly translations (EXPLORE).

**Integrity:** No mode may modify translation or Tafsir content. Presentation may differ, but source content is immutable.

### 4.3 Morphology and Roots

**Data Integrity:** Root and lemma data is validated and immutable. No mode may modify morphological classifications.

**Presentation:** FAHM presents full morphological analysis. EXPLORE may present simplified vocabulary learning. NOOR may present age-appropriate word discovery.

### 4.4 Topics, Dimensions, and Domains

**Editorial Status:** All topics, dimensions, and domains carry `pending-scholarly-review` status. No mode may claim scholarly approval without evidence.

**Presentation:** Each mode may present topics differently:
- FAHM: Full topic pages with all relations and scholarly context
- EXPLORE: Simplified topic introductions with beginner-friendly explanations
- NOOR: Age-appropriate themes (future, pending child-safety spec)

### 4.5 Provenance and Editorial Governance

**Transparency:** All content carries provenance metadata (method, curator, review date, status).

**Integrity:** No mode may fabricate scholarly approval or reviewer identity.

**Visibility:** Unresolved scholarly or editorial review states must remain visible internally.

---

## 5. Data Flow and State Management

### 5.1 Shared Data

All modes access shared data through services:

```typescript
// Example: Topic service
import { getTopic, getAllTopics } from '@/lib/topics/data';

// Used by all modes
const topic = getTopic('patience');
```

No mode-specific data duplication. All modes read from the same source.

### 5.2 Mode-Specific State

Each mode maintains its own state:

```typescript
// Mode context
interface ModeContext {
  mode: 'noor' | 'fahm' | 'explore';
  preferences: ModePreferences;
  uiState: ModeUIState;
}

// Mode-specific preferences
interface ModePreferences {
  // NOOR: parental controls, audio preferences
  // FAHM: translation selection, study tools
  // EXPLORE: glossary preferences, reading path progress
}
```

### 5.3 Personal Data

Personal data (bookmarks, notes, collections, journey progress) stored in localStorage:

- `alhuda.bookmarks.v1`
- `alhuda.notes.v1`
- `alhuda.collections.v1`
- `alhuda.journey-progress.v1`
- `alhuda.selected-mode.v1`

Personal data is mode-agnostic. A bookmark created in FAHM is accessible in EXPLORE (if the user switches modes).

---

## 6. Navigation and Onboarding

### 6.1 Mode Selection

**Onboarding:**
- First-time users see a mode selection screen
- Screen explains what each mode offers
- No identity assumptions ("I am a Muslim" → "I want to study the Quran deeply")
- No account creation required
- Users can skip onboarding and default to FAHM

**Mode Selector:**
- Persistent mode selector in navigation (header or sidebar)
- Allows users to switch modes at any time
- Shows current mode clearly
- Does not make mode selection a permanent identity label

### 6.2 Mode-Specific Navigation

**NOOR:**
- Home
- Learn
- Stories
- Activities
- Parent Area

**FAHM:**
- Quran
- Learn
- Topics
- Roots
- Study Journeys
- My Study

**EXPLORE:**
- Discover
- Questions
- Topics
- Reading Paths
- Quran

### 6.3 Cross-Mode Navigation

Users can navigate between modes:
- Mode selector in navigation
- Deep links to specific content in any mode
- Shared Quran navigation (surah/ayah selector works across modes)

---

## 7. Accessibility and Localization

### 7.1 Accessibility

All modes must meet WCAG 2.1 AA standards:
- Keyboard navigation
- Screen reader support
- High contrast mode
- Adjustable font sizes
- Arabic text rendering

NOOR requires additional accessibility for young users:
- Large touch targets
- Simple navigation
- Audio support

### 7.2 Localization

**Current State:**
- English editorial content
- Arabic Quran text
- Urdu translations (pending scholarly review)

**Future:**
- Each mode may support additional languages
- Localization must preserve attribution and provenance
- No auto-generated translations (policy)

---

## 8. Security and Privacy

### 8.1 General Principles

- No accounts (D-09)
- No cloud sync (not authorized)
- Local-first data storage
- No tracking or analytics (unless explicitly authorized)
- No third-party data sharing

### 8.2 NOOR-Specific Requirements

NOOR requires additional security and privacy measures (see NOOR-CHILD-SAFETY-SPECIFICATION.md):
- Parental consent mechanism
- Data minimization
- No external links without approval
- No social features without approval
- Age-appropriate content filtering
- Parental controls and oversight

---

## 9. Implementation Phases

### Phase 1: Architecture Validation (Current)
- ✅ Three-mode architecture approved (D-01)
- ✅ Technical foundation confirmed (D-02)
- ✅ Shared foundation approach approved (D-03)
- ⏳ Detailed specifications for stakeholder review

### Phase 2: FAHM Refinement
- Map existing features to FAHM (FAHM-FUNCTIONALITY-MAP.md)
- Identify UX and information architecture gaps
- Improve existing Quran study experience
- Preserve current working functionality

### Phase 3: EXPLORE Specification
- Define newcomer personas and entry points
- Define beginner-friendly content requirements (EXPLORE-CONTENT-STANDARDS.md)
- Establish editorial and source standards
- Produce user flows and acceptance criteria

### Phase 4: NOOR Specification
- Define child and parent experiences
- Establish child-safety and privacy requirements (NOOR-CHILD-SAFETY-SPECIFICATION.md)
- Define age-appropriate learning progression
- Review all proposed interactive and data-collection features

### Phase 5: Implementation Planning
- Establish dependencies
- Define implementation boundaries
- Write acceptance criteria
- Create comprehensive sprint plan (only after architecture fully approved)

---

## 10. Open Questions

The following questions remain pending stakeholder decisions:

| ID | Question | Impact on Architecture |
|---|---|---|
| Q-1 | NOOR parent-mediated or direct access? | Affects NOOR onboarding flow |
| Q-2 | EXPLORE onboarding required? | Affects EXPLORE entry experience |
| Q-3 | Free mode switching? | Affects navigation architecture |
| Q-4 | FAHM retain all tools? | Affects FAHM scope |
| Q-5 | Prioritize Hifz, Namaz, journal, knowledge graph? | Affects FAHM roadmap |
| Q-6 | Mode preference stored locally? | Affects mode management |
| Q-7 | NOOR age groups and parental controls? | Affects NOOR scope and safety spec |

---

## 11. Acceptance Criteria

This specification is ready for stakeholder approval when:

- [ ] Three-mode architecture clearly defined
- [ ] Shared foundation approach validated
- [ ] Mode boundaries and responsibilities explicit
- [ ] Technical architecture within Next.js specified
- [ ] Data flow and state management defined
- [ ] Navigation and onboarding designed
- [ ] Accessibility and localization requirements identified
- [ ] Security and privacy requirements specified
- [ ] Implementation phases outlined
- [ ] Open questions visible
- [ ] No implementation authorized

---

## 12. Conclusion

This document specifies the foundational architecture for Al-Huda's three-mode product. The architecture:

- ✅ Restores the original PRD v2.0 vision (NOOR, FAHM, EXPLORE)
- ✅ Retains the current Next.js web-first technical foundation
- ✅ Maintains one shared Quran and reference foundation
- ✅ Treats FAHM as the continuation of the current product
- ✅ Requires child-safety specification before NOOR implementation
- ✅ Designs EXPLORE as a beginner-first discovery experience
- ✅ Preserves account-free, local-first behavior
- ✅ Keeps AI religious answers disabled

**Next Steps:**
1. Stakeholder review of this specification
2. Stakeholder review of detailed specifications (FAHM-FUNCTIONALITY-MAP.md, EXPLORE-CONTENT-STANDARDS.md, NOOR-CHILD-SAFETY-SPECIFICATION.md, MODE-NAVIGATION-SPECIFICATION.md)
3. Resolution of open questions (Q-1 through Q-7)
4. Approval of detailed specifications
5. Implementation planning (only after all specifications approved)

**Authorization Status:** This is a specification for stakeholder review, not an implementation authorization.

---

**Document prepared by:** Automated quality review  
**Date:** November 11, 2026  
**Status:** Draft — Pending Stakeholder Review
