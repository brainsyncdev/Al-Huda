# NOOR Child-Safety and Privacy Specification

**Document Status:** Draft — Pending Stakeholder Review AND Legal/Expert Review  
**Date:** November 11, 2026  
**Baseline:** PRD v4.1 / Sprint 54  
**Decision Reference:** STAKEHOLDER-DECISION-2026-11-11.md (D-07)  
**Architecture Reference:** THREE-MODE-ARCHITECTURE.md  
**Purpose:** Mandatory child-safety and privacy specification for NOOR mode (ages 3-12)

---

## ⚠️ Authorization Boundary

**This document is a specification only. It does NOT authorize NOOR implementation.**

Per Decision D-07: *"Require child-safety specification before NOOR implementation."*

NOOR implementation is **BLOCKED** until:
1. This specification is completed
2. This specification is reviewed by legal counsel (regulatory compliance)
3. This specification is reviewed by a child development expert
4. This specification is reviewed by an Islamic scholar (content appropriateness)
5. This specification is approved by the product owner
6. All open questions (Q-1, Q-7) are resolved

**No source code, components, routes, or features for NOOR may be implemented until all approvals are received.**

---

## 1. Executive Summary

### 1.1 Purpose

This document is the **mandatory child-safety and privacy specification** for NOOR, the children's mode (ages 3-12) of the Al-Huda Quran study application. It defines the safety, privacy, content, interaction, and technical requirements that must be met before any NOOR implementation begins.

### 1.2 Regulatory Context

NOOR serves children, a protected class under multiple international regulations. This specification ensures compliance with:
- **COPPA** (Children's Online Privacy Protection Act) — United States
- **GDPR-K** (GDPR provisions for children) — European Union
- **UK Age Appropriate Design Code** — United Kingdom
- Other applicable child protection regulations

### 1.3 Core Principles

1. **Child safety is non-negotiable** — No feature may compromise child safety
2. **Privacy by design** — Minimize data collection to what is strictly necessary
3. **Parent-mediated access** — Parents control and oversee the child's experience (Q-1 recommendation)
4. **Local-first** — No cloud sync, no accounts, no third-party data sharing (D-09)
5. **Age-appropriate content** — All content reviewed by child development experts and Islamic scholars
6. **No pressure** — Positive reinforcement without gamification pressure or competitive features
7. **Transparency** — Parents have full visibility and control over the child's experience

### 1.4 Scope

This specification covers:
- Legal and regulatory compliance
- Age range and developmental considerations
- Parental consent and mediation
- Data collection and privacy
- Content safety
- Interaction design safety
- Technical safety measures
- Accessibility for children
- Parent dashboard
- Incident response
- Review and audit processes
- Open questions requiring stakeholder decisions
- Approval requirements

### 1.5 What This Specification Does NOT Do

- ❌ Authorize NOOR implementation
- ❌ Define specific features or user flows
- ❌ Replace legal counsel review
- ❌ Replace expert content review
- ❌ Address FAHM or EXPLORE modes

---

## 2. Legal and Regulatory Framework

### 2.1 COPPA (Children's Online Privacy Protection Act) — United States

**Applicability:** COPPA applies to online services directed at children under 13, or services with actual knowledge that they are collecting personal information from children under 13.

**Key Requirements:**
- **Verifiable parental consent** required before collecting personal information from children under 13
- **Privacy policy** must be clear and accessible to parents
- **Parental rights** to review, delete, and refuse further collection of child's data
- **Data minimization** — collect only what is reasonably necessary
- **No conditional participation** — cannot condition child's participation on excessive data collection

**NOOR Compliance Strategy:**
- Implement verifiable parental consent mechanism before any data collection
- Provide clear privacy policy in parent dashboard
- Enable parent to view, export, and delete child's data at any time
- Collect only learning progression data (no personal identifiers beyond what is necessary)
- No cloud sync or third-party data sharing (local-first architecture)

**Risk Assessment:**
- ✅ Low risk: Local-first storage, no cloud sync
- ✅ Low risk: No accounts or personal identifiers
- ⚠️ Medium risk: Verifiable parental consent mechanism must be technically robust
- ⚠️ Medium risk: Privacy policy must be reviewed by legal counsel

### 2.2 GDPR-K (GDPR Provisions for Children) — European Union

**Applicability:** GDPR Article 8 requires parental consent for children under 16 (or lower age set by member state, minimum 13) for information society services.

**Key Requirements:**
- **Parental consent** required for children under 16 (or member state age)
- **Privacy notices** must be in clear, plain language suitable for children
- **Right to erasure** — children (or parents) can request data deletion
- **Data protection by design and by default**
- **Data Protection Impact Assessment (DPIA)** may be required for processing children's data

**NOOR Compliance Strategy:**
- Implement parental consent mechanism with age-appropriate privacy notices
- Enable data deletion (parent-initiated)
- Local-first storage minimizes data processing risks
- Conduct DPIA before implementation (legal counsel to confirm requirement)

**Risk Assessment:**
- ✅ Low risk: Local-first storage reduces data processing scope
- ⚠️ Medium risk: DPIA may be required — legal counsel to confirm
- ⚠️ Medium risk: Age-appropriate privacy notices require expert review

### 2.3 UK Age Appropriate Design Code

**Applicability:** Applies to information society services likely to be accessed by children in the UK.

**Key Requirements (15 Standards):**
1. **Best interests of the child** — primary consideration
2. **Data protection impact assessments** — required for high-risk processing
3. **Age-appropriate application** — design for different age groups
4. **Transparency** — clear, age-appropriate privacy information
5. **Detrimental use of data** — no use harmful to child's wellbeing
6. **Policies and community standards** — uphold own published terms
7. **Default settings** — privacy-protective by default
8. **Data minimization** — collect only what is necessary
9. **Data sharing** — minimize data sharing
10. **Geolocation** — switch off by default (not applicable to NOOR)
11. **Parental controls** — age-appropriate tools for parents
12. **Profiling** — switch off by default (not applicable to NOOR)
13. **Nudge techniques** — no manipulative design
14. **Connected and wired products** — not applicable
15. **Online tools** — easy-to-use reporting and complaint mechanisms

**NOOR Compliance Strategy:**
- Design for child's best interests (no pressure, no manipulation)
- Conduct DPIA (see GDPR-K)
- Age-appropriate design for 3-5, 6-8, 9-12 groups
- Transparent privacy information in parent dashboard
- No detrimental data use (no tracking, no analytics on children)
- Privacy-protective default settings (local-first, no cloud sync)
- Data minimization (only learning progression data)
- No data sharing (local-first architecture)
- Parental controls in parent dashboard
- No profiling (no AI, no behavioral tracking)
- No nudge techniques (no pressure-based gamification)
- Reporting mechanism in parent dashboard

**Risk Assessment:**
- ✅ Low risk: Local-first, no tracking, no profiling
- ⚠️ Medium risk: Age-appropriate design requires expert review
- ⚠️ Medium risk: Nudge techniques audit required before launch

### 2.4 Other Applicable Regulations

**Canada (PIPEDA):** Similar to GDPR-K — parental consent required for children under 13.

**Australia (Privacy Act):** No specific children's provisions, but general privacy principles apply.

**International Considerations:**
- NOOR may be accessed globally
- Must comply with strictest applicable regulation (GDPR-K + UK Code)
- Legal counsel should review global applicability

### 2.5 Legal Review Requirement

**⚠️ CRITICAL:** This specification is NOT legal advice. Before NOOR implementation:

1. **Legal counsel must review** this specification for regulatory compliance
2. **Legal counsel must confirm** verifiable parental consent mechanism
3. **Legal counsel must confirm** whether DPIA is required
4. **Legal counsel must draft** privacy policy and parental consent language
5. **Legal counsel must review** parent dashboard and data deletion flows

**Action Required:** Engage legal counsel specializing in child privacy law before proceeding.

---

## 3. Age Range and Developmental Stages

### 3.1 Proposed Age Range

**Proposed:** 3-12 years old (TBD — Q-7)

**Rationale:**
- Age 3: Children begin recognizing patterns, shapes, and sounds
- Age 12: Transition to adolescent learning (FAHM mode)
- Wide range accommodates different developmental stages

**Open Question (Q-7):** Which age groups should be included at launch?

### 3.2 Developmental Sub-Groups

To ensure age-appropriate design, NOOR should consider three sub-groups:

| Age Group | Developmental Stage | Characteristics | Design Implications |
|-----------|---------------------|-----------------|---------------------|
| **3-5 years** | Pre-readers | Limited reading ability, short attention span, need audio/visual support, learn through play | Audio-first, large touch targets, simple navigation (max 1 level), parental co-use recommended |
| **6-8 years** | Early readers | Basic reading skills, developing attention span, enjoy stories and games, need guidance | Audio + text, moderate touch targets, simple navigation (max 2 levels), some independent use |
| **9-12 years** | Older children | Fluent readers, longer attention span, can handle more complex content, desire independence | Text-first with audio support, standard touch targets, deeper navigation (max 3 levels), mostly independent use |

### 3.3 Developmental Considerations

#### Cognitive Development
- **3-5:** Concrete thinking, need visual and audio cues, cannot understand abstract concepts
- **6-8:** Beginning abstract thinking, can follow simple narratives, need repetition
- **9-12:** Developing abstract thinking, can understand context, enjoy discovery

#### Emotional Development
- **3-5:** Need reassurance, easily frustrated, need immediate positive feedback
- **6-8:** Developing resilience, can handle mild challenges, enjoy accomplishment
- **9-12:** Seeking independence, can handle constructive feedback, enjoy mastery

#### Physical Development
- **3-5:** Developing fine motor skills, need large touch targets (min 60px), cannot use small buttons
- **6-8:** Improving fine motor skills, can use medium touch targets (min 48px)
- **9-12:** Developed fine motor skills, can use standard touch targets (min 44px)

#### Social Development
- **3-5:** Parallel play, need parental co-use, cannot understand social features
- **6-8:** Beginning cooperative play, can understand simple social concepts, no competitive features
- **9-12:** Cooperative play, can understand social context, but competitive features still risky

### 3.4 Recommendation: Launch Strategy

**Recommendation (Q-7):** Launch with a single age group first, then expand.

**Option A: Launch with 6-8 years**
- ✅ Balances readability and simplicity
- ✅ Can use audio + text
- ✅ Moderate complexity
- ❌ Excludes youngest and oldest children

**Option B: Launch with 9-12 years**
- ✅ Can use text-first design
- ✅ More independent use
- ✅ Easier to implement
- ❌ Excludes younger children

**Option C: Launch with all age groups (3-12)**
- ✅ Full age range from start
- ❌ Requires three different UI designs
- ❌ Complex content filtering
- ❌ Higher development cost
- ❌ Higher safety risk

**Recommended:** Option A (6-8 years) for initial launch, then expand to 3-5 and 9-12 in subsequent releases.

**Rationale:**
- Reduces complexity and safety risk
- Allows focused testing with one age group
- Enables iterative improvement before expanding
- Lower development cost for initial launch

### 3.5 Age Verification

**Challenge:** How to verify child's age without collecting personal information?

**Proposed Approach:**
- Parent sets child's age during profile creation
- No independent verification (not required if parent-mediated)
- Age determines content filtering and UI design
- Parent can adjust age at any time

**Risk:** Parent may misreport age, but this is acceptable if parent is mediating access.

---

## 4. Parental Consent and Mediation

### 4.1 Parental Consent Requirement

**Legal Requirement:** Verifiable parental consent is required before collecting any data from children under 13 (COPPA) or under 16 (GDPR-K).

**NOOR Approach:**
- Parent must provide consent before child can use NOOR
- Consent must be verifiable (see Section 4.2)
- Consent must be informed (clear privacy policy)
- Consent must be revocable (parent can withdraw at any time)

### 4.2 Verifiable Parental Consent Mechanism

**COPPA-Approved Methods:**
1. **Signed consent form** (mail, fax, scan)
2. **Credit card transaction** (small charge, refunded)
3. **Phone call** to trained personnel
4. **Video conference** with trained personnel
5. **Government ID verification** (copy checked then deleted)
6. **Email plus additional step** (e.g., email + phone verification)

**Recommended for NOOR:** Email plus additional step (lowest friction while meeting requirements)

**Proposed Flow:**
1. Parent creates child profile in NOOR
2. Parent enters email address
3. System sends consent email with unique link
4. Parent clicks link and confirms consent
5. Parent completes additional verification step (e.g., enters phone number for SMS code)
6. Consent recorded with timestamp and method

**Technical Implementation:**
- Store consent record in localStorage: `alhuda.noor.parental-consent.v1`
- Record: consent timestamp, method, parent email (hashed), child profile ID
- Enable parent to view consent record in parent dashboard
- Enable parent to withdraw consent (deletes child profile and all data)

**Legal Review Required:** Legal counsel must confirm this mechanism meets COPPA and GDPR-K requirements.

### 4.3 Parent Account vs. Child Account

**NOOR Approach:**
- **No traditional accounts** (D-09 — account-free)
- **Parent profile:** Local-only, stores consent record, child profiles, and parental controls
- **Child profile:** Local-only, stores learning progression and preferences
- **No cloud sync** (D-09)
- **No authentication** beyond parental consent verification

**Parent Profile Data:**
- Consent record (timestamp, method, hashed email)
- Child profiles (names, ages, learning progression)
- Parental controls (content filters, time limits, etc.)
- Privacy settings

**Child Profile Data:**
- Child name (display only, not stored as personal identifier)
- Child age (for content filtering)
- Learning progression (completed lessons, activities)
- Preferences (audio on/off, font size, etc.)

### 4.4 Parent Dashboard

**Purpose:** Provide parents with oversight and control over child's NOOR experience.

**Access:**
- Separate from child interface
- Requires parent authentication (simple PIN or password)
- Accessible via "Parent Area" in NOOR navigation

**Features:**
- **Progress overview:** What child has learned (non-pressuring)
- **Content visibility:** What content child has accessed
- **Time tracking:** How long child has spent in NOOR
- **Settings management:** Adjust parental controls
- **Content filtering:** Control which content is available
- **Time limits:** Set daily or session time limits
- **Profile management:** Create, edit, pause, or delete child profiles
- **Data management:** View, export, or delete child's data
- **Consent management:** View or withdraw parental consent

**Design Principles:**
- Clear, non-technical language
- Easy to understand progress (no complex metrics)
- Quick access to controls
- Transparent data practices

### 4.5 Parental Controls

**Essential Controls (Must-Have):**
- ✅ Content filtering by age group
- ✅ Time limits (daily or session)
- ✅ Ability to pause or delete child profile
- ✅ Ability to view and delete child's data
- ✅ Ability to withdraw consent

**Recommended Controls (Nice-to-Have):**
- Audio on/off toggle
- Specific content blocking (e.g., block certain stories)
- Progress notifications (email or in-app)
- Multi-child profile management

**Deferred Controls (Future):**
- Detailed analytics
- Social features (if ever approved)
- External content approval workflow

### 4.6 Parent-Mediated Entry (Q-1)

**Recommendation:** Parent-mediated entry with explicit consent.

**Rationale:**
- Meets legal requirements (verifiable parental consent)
- Ensures parent awareness of child's activity
- Enables parent to control and oversee experience
- Reduces risk of inappropriate access

**Implementation:**
- Child cannot access NOOR without parent creating profile
- Parent must provide consent before profile creation
- Parent dashboard provides ongoing oversight
- Child can use NOOR independently after parent setup (but parent can monitor)

**Alternative (Not Recommended):** Direct child access
- ❌ Does not meet COPPA requirements
- ❌ No parental oversight
- ❌ Higher safety risk
- ❌ Legal liability

**Decision Required (Q-1):** Confirm parent-mediated entry approach.

---

## 5. Data Collection Minimization

### 5.1 Data Collection Principles

**Principle 1: Minimize data collection**
- Collect only what is strictly necessary for learning progression
- Do not collect personal identifiers beyond what is required
- Do not collect data for analytics or tracking

**Principle 2: Local-first storage**
- All data stored in localStorage (no cloud sync)
- No data leaves the device
- No third-party data sharing

**Principle 3: Parent control**
- Parent can view all collected data
- Parent can export data
- Parent can delete data at any time

**Principle 4: No tracking**
- No analytics on child's behavior
- No tracking of child's activity
- No behavioral profiling

### 5.2 What Data IS Collected

**Child Profile Data (Local Storage):**
| Data | Purpose | Storage Location | Retention |
|------|---------|------------------|-----------|
| Child name (display only) | Personalization | localStorage | Until profile deleted |
| Child age | Content filtering | localStorage | Until profile deleted |
| Learning progression | Track completed lessons | localStorage | Until profile deleted |
| Preferences (audio, font size) | User experience | localStorage | Until profile deleted |

**Parent Profile Data (Local Storage):**
| Data | Purpose | Storage Location | Retention |
|------|---------|------------------|-----------|
| Consent record | Legal compliance | localStorage | Until consent withdrawn |
| Parent email (hashed) | Consent verification | localStorage | Until consent withdrawn |
| Child profiles | Profile management | localStorage | Until profiles deleted |
| Parental controls | Oversight | localStorage | Until profile deleted |

### 5.3 What Data is NOT Collected

**Strictly Prohibited:**
- ❌ Personal identifiers (full name, address, phone number, school)
- ❌ Location data
- ❌ Device identifiers
- ❌ IP address (beyond standard web request)
- ❌ Browser fingerprinting
- ❌ Behavioral tracking
- ❌ Analytics data
- ❌ Third-party data sharing
- ❌ Cloud sync data
- ❌ Social media data
- ❌ Contact information

### 5.4 Local-First Storage

**Storage Mechanism:** localStorage (browser-based)

**Advantages:**
- No cloud infrastructure
- No data transmission
- No third-party access
- Parent can clear data by clearing browser storage
- Complies with account-free, local-first architecture (D-09)

**Limitations:**
- Data lost if browser cache cleared
- No cross-device sync
- No backup (unless parent exports)

**Mitigation:**
- Parent can export data from parent dashboard
- Clear warning that data is local-only
- No expectation of data persistence across devices

### 5.5 No Third-Party Data Sharing

**Policy:** NOOR does not share any data with third parties.

**Implementation:**
- No third-party scripts in NOOR environment
- No third-party analytics
- No third-party tracking
- No third-party advertising
- No data transmission to external servers

**Technical Enforcement:**
- Content Security Policy (CSP) blocks external scripts
- No third-party cookies
- No external API calls (except for Quran text, which is public domain)

### 5.6 No Tracking or Analytics

**Policy:** NOOR does not track or analyze child behavior.

**Prohibited:**
- ❌ Page view tracking
- ❌ Click tracking
- ❌ Session duration tracking
- ❌ Behavior analytics
- ❌ A/B testing on children
- ❌ Conversion tracking

**Allowed:**
- ✅ Learning progression tracking (for child's benefit)
- ✅ Time spent tracking (for parent visibility)
- ✅ Content access tracking (for parent visibility)

**Rationale:** Tracking children creates privacy risks and legal liability. Learning progression is necessary for the product to function; tracking is not.

### 5.7 Data Retention Policy

**Child Profile Data:**
- Retained until parent deletes child profile
- No automatic expiration
- Parent can delete at any time

**Parent Profile Data:**
- Retained until parent withdraws consent
- No automatic expiration
- Parent can withdraw consent at any time

**Consent Record:**
- Retained as long as child profile exists
- Deleted when consent withdrawn or profile deleted

### 5.8 Data Deletion Policy

**Parent-Initiated Deletion:**
- Parent can delete child profile from parent dashboard
- Deletion removes all child data from localStorage
- Deletion is immediate and irreversible
- No data recovery possible

**Consent Withdrawal:**
- Parent can withdraw consent from parent dashboard
- Withdrawal deletes all child profiles and data
- Withdrawal deletes consent record
- Child can no longer access NOOR

**Technical Implementation:**
- Delete localStorage keys associated with child profile
- Clear React context state
- Redirect to NOOR home (no profile selected)

**Legal Compliance:**
- Meets COPPA "right to delete" requirement
- Meets GDPR-K "right to erasure" requirement
- Clear, easy-to-use deletion mechanism

---

## 6. Content Safety

### 6.1 Age-Appropriate Content Filtering

**Requirement:** All content must be age-appropriate for the child's age group.

**Implementation:**
- Content tagged with age appropriateness (3-5, 6-8, 9-12)
- Parent sets child's age during profile creation
- System filters content based on child's age
- Parent can override filters in parent dashboard

**Content Categories:**
- ✅ Quran text (age-appropriate presentation)
- ✅ Stories from the Quran (age-appropriate language)
- ✅ Arabic vocabulary (age-appropriate complexity)
- ✅ Interactive activities (age-appropriate difficulty)
- ✅ Audio recitations (age-appropriate length)
- ❌ Complex theological concepts (unless age-appropriate)
- ❌ Violent or frightening content
- ❌ Inappropriate imagery

### 6.2 Prohibited Content

**Strictly Prohibited:**
- ❌ Violent content (graphic descriptions, images)
- ❌ Frightening content (scary stories, disturbing imagery)
- ❌ Inappropriate content (sexual, drug-related, etc.)
- ❌ Hate speech or discrimination
- ❌ Political content
- ❌ Commercial content or advertising
- ❌ User-generated content (unless explicitly approved)
- ❌ External links (unless explicitly approved by parent)

**Rationale:** Children are vulnerable to inappropriate content. NOOR must provide a safe, controlled environment.

### 6.3 No External Links Without Parental Approval

**Policy:** NOOR does not include external links by default.

**Exception:** Parent can approve specific external links in parent dashboard.

**Implementation:**
- No external links in NOOR content by default
- Parent dashboard includes "Approved Links" section
- Parent can add specific URLs to approved list
- Child can access only approved links
- All other links blocked

**Rationale:** External links can lead to inappropriate content. Parental approval ensures safety.

### 6.4 No User-Generated Content

**Policy:** NOOR does not allow user-generated content.

**Prohibited:**
- ❌ Child cannot create content
- ❌ Child cannot share content
- ❌ Child cannot comment on content
- ❌ Child cannot upload images or files

**Rationale:** User-generated content creates safety risks (inappropriate content, contact with strangers). NOOR is a read-only, learning-focused experience.

### 6.5 No Social Features Without Explicit Approval

**Policy:** NOOR does not include social features by default.

**Prohibited:**
- ❌ Chat or messaging
- ❌ Friend lists
- ❌ Social sharing
- ❌ Multiplayer features
- ❌ Leaderboards or competitions

**Exception:** Parent can enable specific social features in parent dashboard (future, not in initial launch).

**Rationale:** Social features create safety risks (contact with strangers, cyberbullying). NOOR is a solo learning experience.

### 6.6 No Chat or Messaging

**Policy:** NOOR does not include any chat or messaging features.

**Prohibited:**
- ❌ Child-to-child chat
- ❌ Child-to-adult chat
- ❌ Group chat
- ❌ Private messaging
- ❌ Voice chat
- ❌ Video chat

**Rationale:** Chat features create severe safety risks (predators, cyberbullying, inappropriate contact). NOOR is a learning experience, not a social platform.

### 6.7 No Advertising

**Policy:** NOOR does not include any advertising.

**Prohibited:**
- ❌ Display ads
- ❌ Video ads
- ❌ Sponsored content
- ❌ Product placements
- ❌ Affiliate links
- ❌ In-app purchases

**Rationale:** Advertising exploits children's vulnerability. NOOR is a non-commercial, educational experience.

### 6.8 Content Review Process

**Requirement:** All NOOR content must be reviewed by:
1. **Child development experts** — for age-appropriateness
2. **Islamic scholars** — for religious accuracy and appropriateness

**Review Process:**
1. Content created by editorial team
2. Child development expert reviews for age-appropriateness
3. Islamic scholar reviews for religious accuracy
4. Content approved or revised
5. Approved content tagged with reviewer credentials
6. Content published to NOOR

**Documentation:**
- Each content item includes metadata:
  - Child development reviewer (name, credentials, date)
  - Islamic scholar reviewer (name, credentials, date)
  - Approval status
  - Review notes

**Ongoing Review:**
- Content reviewed annually
- Parent can report concerns (see Incident Response)
- Content updated or removed based on feedback

**Legal Review Required:** Legal counsel should review content approval process for regulatory compliance.

---

## 7. Interaction Design Safety

### 7.1 No Pressure-Based Gamification

**Policy:** NOOR does not use pressure-based gamification techniques.

**Prohibited:**
- ❌ Streaks that punish absence (e.g., "You lost your 7-day streak!")
- ❌ Time-limited challenges (e.g., "Complete this in 24 hours!")
- ❌ Loss aversion (e.g., "Don't lose your progress!")
- ❌ Social pressure (e.g., "Your friends are ahead of you!")
- ❌ Punitive notifications (e.g., "You haven't learned today!")

**Allowed:**
- ✅ Positive reinforcement (e.g., "Great job! You learned 3 new words!")
- ✅ Progress visualization (e.g., "You've completed 5 lessons")
- ✅ Encouragement (e.g., "Keep going! You're doing well!")
- ✅ Celebration of achievement (e.g., animations, sounds)

**Rationale:** Pressure-based gamification can create anxiety, obsession, and unhealthy relationships with learning. NOOR promotes positive, pressure-free learning.

### 7.2 No Competitive Features Between Children

**Policy:** NOOR does not include competitive features between children.

**Prohibited:**
- ❌ Leaderboards
- ❌ Rankings
- ❌ Competitions
- ❌ Comparisons (e.g., "You're behind your friends!")
- ❌ Multiplayer challenges

**Allowed:**
- ✅ Personal progress tracking (child vs. their own past performance)
- ✅ Individual achievements (e.g., "You learned 10 words!")
- ✅ Self-paced learning

**Rationale:** Competition can create anxiety, low self-esteem, and unhealthy comparisons. NOOR focuses on individual learning and growth.

### 7.3 No In-App Purchases

**Policy:** NOOR does not include any in-app purchases.

**Prohibited:**
- ❌ Paid content
- ❌ Paid features
- ❌ Paid upgrades
- ❌ Subscriptions
- ❌ Virtual currency
- ❌ Loot boxes

**Rationale:** In-app purchases exploit children's vulnerability and create financial risk for parents. NOOR is a free, educational experience.

### 7.4 No Upselling or Cross-Selling

**Policy:** NOOR does not upsell or cross-sell other products or services.

**Prohibited:**
- ❌ Promotions for FAHM or EXPLORE
- ❌ Promotions for other apps
- ❌ Promotions for products or services
- ❌ Affiliate marketing

**Rationale:** Upselling exploits children's vulnerability. NOOR is a focused, non-commercial experience.

### 7.5 Positive Reinforcement Without Pressure

**Policy:** NOOR uses positive reinforcement to encourage learning without creating pressure.

**Techniques:**
- ✅ Celebrate achievements (e.g., "You learned a new surah!")
- ✅ Provide encouragement (e.g., "Keep practicing!")
- ✅ Show progress (e.g., "You've completed 5 lessons")
- ✅ Use positive language (e.g., "Great job!")
- ✅ Use animations and sounds for celebration

**Avoid:**
- ❌ Pressure language (e.g., "You must learn today!")
- ❌ Guilt language (e.g., "You haven't learned in 3 days!")
- ❌ Comparison language (e.g., "Other children are ahead!")
- ❌ Punitive language (e.g., "You lost your streak!")

**Rationale:** Positive reinforcement encourages learning without creating anxiety or obsession.

### 7.6 Break Reminders (Screen Time Awareness)

**Policy:** NOOR reminds children to take breaks to promote healthy screen time habits.

**Implementation:**
- After 20 minutes of continuous use, show break reminder
- Reminder is gentle and non-intrusive (e.g., "Time for a break! Go play outside!")
- Child can dismiss reminder and continue
- Parent can adjust break interval in parent dashboard
- Parent can disable break reminders (not recommended)

**Rationale:** Excessive screen time is harmful to children. Break reminders promote healthy habits.

### 7.7 Easy Exit to Parent Area

**Policy:** NOOR provides easy exit to parent area for children who want to stop or parents who want to check in.

**Implementation:**
- "Exit" button always visible in NOOR interface
- Exit returns to NOOR home (no profile selected)
- Parent can access parent dashboard from NOOR home
- No confirmation required to exit (easy to stop)

**Rationale:** Children should be able to stop using NOOR at any time. Parents should be able to access the parent area easily.

---

## 8. Technical Safety Measures

### 8.1 Sandboxed Child Environment

**Requirement:** NOOR must be sandboxed to prevent access to FAHM or EXPLORE content without parent approval.

**Implementation:**
- NOOR routes isolated in `(noor)` route group
- NOOR components isolated in `components/noor/` directory
- NOOR context provider separate from FAHM/EXPLORE
- No shared state between NOOR and other modes
- Parent must explicitly approve mode switching

**Technical Enforcement:**
- Route guards prevent access to FAHM/EXPLORE routes from NOOR
- Component library separation (no adult content leakage)
- Context isolation (NOOR context does not include FAHM/EXPLORE data)

### 8.2 Separate Component Library for NOOR

**Requirement:** NOOR must use a separate component library to prevent adult content leakage.

**Implementation:**
- `components/noor/` directory for NOOR-specific components
- NOOR components designed for children (large touch targets, simple navigation)
- NOOR components do not include adult-oriented features
- Shared components (e.g., Quran text display) reviewed for child-appropriateness

**Review Process:**
- All NOOR components reviewed by child development experts
- All shared components used in NOOR reviewed for child-appropriateness
- No adult content (e.g., personal notes, journaling) in NOOR components

### 8.3 Content Security Policy (CSP) Strict Mode

**Requirement:** NOOR must enforce strict CSP to prevent unauthorized scripts and data exfiltration.

**Implementation:**
```typescript
// next.config.js
const noorCSP = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self';
  connect-src 'self';
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
`;
```

**Enforcement:**
- No external scripts allowed
- No inline scripts (unless necessary for Next.js)
- No external fonts (unless reviewed and approved)
- No external connections (except for Quran text, which is public domain)
- No framing (prevent clickjacking)

**Review Required:** Security expert should review CSP configuration before launch.

### 8.4 No Third-Party Scripts in NOOR Environment

**Policy:** NOOR does not load any third-party scripts.

**Prohibited:**
- ❌ Third-party analytics (e.g., Google Analytics)
- ❌ Third-party tracking (e.g., Facebook Pixel)
- ❌ Third-party advertising (e.g., Google AdSense)
- ❌ Third-party fonts (unless reviewed and approved)
- ❌ Third-party CDNs (unless reviewed and approved)

**Allowed:**
- ✅ Next.js framework (first-party)
- ✅ React (first-party)
- ✅ Tailwind CSS (first-party)
- ✅ Quran text API (public domain, reviewed and approved)

**Enforcement:**
- CSP blocks external scripts
- No third-party npm packages (unless reviewed and approved)
- Regular audit of dependencies

### 8.5 Secure localStorage Isolation Per Child Profile

**Requirement:** Each child profile must have isolated localStorage to prevent data leakage between profiles.

**Implementation:**
- localStorage keys namespaced by child profile ID
- Example: `alhuda.noor.child.{profileId}.progress.v1`
- Child can access only their own profile data
- Parent can access all child profile data from parent dashboard

**Technical Enforcement:**
- NOOR context includes only current child profile data
- No cross-profile data access
- Parent dashboard has elevated access (requires authentication)

### 8.6 Parent Authentication for Sensitive Actions

**Requirement:** Sensitive actions require parent authentication.

**Sensitive Actions:**
- Creating or deleting child profiles
- Viewing or exporting child data
- Adjusting parental controls
- Withdrawing consent
- Accessing parent dashboard

**Implementation:**
- Parent sets PIN or password during initial setup
- PIN/password stored in localStorage (hashed)
- Parent must enter PIN/password to access parent dashboard
- Parent must enter PIN/password for sensitive actions

**Security Considerations:**
- PIN/password is local-only (no cloud sync)
- If parent forgets PIN/password, they can reset by clearing browser storage (loses all data)
- No password recovery (local-first architecture)

**Recommendation:** Use simple 4-digit PIN for ease of use. Security is not critical (local-only, no cloud data).

---

## 9. Accessibility for Children

### 9.1 Large Touch Targets

**Requirement:** NOOR must use large touch targets for young users.

**Specifications:**
- **3-5 years:** Minimum 60px touch targets
- **6-8 years:** Minimum 48px touch targets
- **9-12 years:** Minimum 44px touch targets (standard)

**Implementation:**
- Buttons and interactive elements sized appropriately
- Adequate spacing between touch targets
- Clear visual feedback on touch

### 9.2 Simple Navigation

**Requirement:** NOOR must use simple navigation appropriate for children.

**Specifications:**
- **3-5 years:** Maximum 1 level deep
- **6-8 years:** Maximum 2 levels deep
- **9-12 years:** Maximum 3 levels deep

**Implementation:**
- Clear, obvious navigation buttons
- Breadcrumbs for deeper navigation
- Easy "back" button always visible
- No hidden menus or complex interactions

### 9.3 Audio Support for Pre-Readers

**Requirement:** NOOR must provide audio support for pre-readers (3-5 years).

**Implementation:**
- All text content has audio narration
- Audio controls (play, pause, stop) always visible
- Audio auto-plays on content load (with parent option to disable)
- High-quality audio recordings (clear, age-appropriate voice)

**Content:**
- Quran recitations (age-appropriate length)
- Story narrations
- Instruction narrations
- Vocabulary pronunciations

### 9.4 High Contrast Mode

**Requirement:** NOOR must support high contrast mode for visually impaired children.

**Implementation:**
- High contrast theme option in parent dashboard
- High contrast colors (black text on white background, or white text on black background)
- High contrast applies to all NOOR components
- Meets WCAG 2.1 AA contrast requirements

### 9.5 Adjustable Font Sizes

**Requirement:** NOOR must support adjustable font sizes for children with visual impairments.

**Implementation:**
- Font size selector in parent dashboard (small, medium, large, extra-large)
- Font size applies to all NOOR text
- Minimum font size: 16px
- Maximum font size: 32px
- Font size preference stored per child profile

### 9.6 Screen Reader Support

**Requirement:** NOOR must support screen readers for visually impaired children.

**Implementation:**
- All interactive elements have appropriate ARIA labels
- All images have alt text
- All content is keyboard-navigable
- Screen reader announcements for dynamic content
- Tested with popular screen readers (VoiceOver, NVDA, JAWS)

### 9.7 Multilingual Support

**Requirement:** NOOR must support multiple languages, starting with English and Arabic.

**Implementation:**
- English UI (default)
- Arabic Quran text (required)
- Arabic UI (future)
- Urdu UI (future)
- Other languages (future)

**Content:**
- Quran text always in Arabic
- Translations and UI in selected language
- Audio narration in selected language

---

## 10. Parent Dashboard

### 10.1 Purpose

The parent dashboard provides parents with oversight and control over their child's NOOR experience. It is separate from the child interface and requires parent authentication.

### 10.2 Access

**Entry Point:** "Parent Area" button in NOOR navigation

**Authentication:**
- Parent sets PIN or password during initial setup
- Parent must enter PIN/password to access dashboard
- PIN/password stored in localStorage (hashed)

**Security:**
- Local-only (no cloud sync)
- No password recovery (clear browser storage to reset)
- Child cannot access parent dashboard

### 10.3 Features

#### Progress Overview
- What child has learned (lessons completed, words learned, stories read)
- Non-pressuring presentation (no streaks, no rankings)
- Visual progress indicators (e.g., progress bars, icons)
- Date range filter (last week, last month, all time)

#### Content Visibility
- What content child has accessed (lessons, stories, activities)
- Timestamps for each content access
- Filter by content type (lessons, stories, activities)

#### Time Spent Tracking
- Total time spent in NOOR
- Time spent per session
- Time spent per day
- Visual timeline of usage

#### Settings Management
- Adjust child's age (affects content filtering)
- Adjust parental controls (content filters, time limits)
- Adjust accessibility settings (font size, high contrast, audio)
- Adjust break reminder interval

#### Content Filtering Controls
- Filter content by age group (3-5, 6-8, 9-12)
- Block specific content (e.g., block certain stories)
- Approve specific external links
- Enable/disable audio narration

#### Profile Management
- Create new child profile
- Edit child profile (name, age)
- Pause child profile (temporarily disable access)
- Delete child profile (permanently delete all data)

#### Data Management
- View child's data (learning progression, preferences)
- Export child's data (JSON or CSV format)
- Delete child's data (permanently delete from localStorage)

#### Consent Management
- View consent record (timestamp, method, hashed email)
- Withdraw consent (deletes all child profiles and data)

### 10.4 Design Principles

- **Clear, non-technical language** — Parents are not developers
- **Easy to understand progress** — No complex metrics or jargon
- **Quick access to controls** — Parents should be able to adjust settings easily
- **Transparent data practices** — Parents should understand what data is collected and why
- **Mobile-friendly** — Parents may access dashboard from mobile devices

### 10.5 Technical Implementation

**Routes:**
- `/noor/parent` — Parent dashboard home
- `/noor/parent/profiles` — Child profile management
- `/noor/parent/progress` — Progress overview
- `/noor/parent/settings` — Settings management
- `/noor/parent/data` — Data management
- `/noor/parent/consent` — Consent management

**Components:**
- `components/noor/parent/` — Parent dashboard components
- Separate from child components
- Requires parent authentication

**State Management:**
- Parent context provider (separate from child context)
- Access to all child profile data
- Parental controls stored in parent context

---

## 11. Incident Response

### 11.1 What Happens If Inappropriate Content Is Discovered

**Scenario:** Inappropriate content is discovered in NOOR (e.g., violent story, frightening image).

**Response:**
1. **Immediate removal** — Content removed from NOOR within 24 hours
2. **Investigation** — Determine how content was approved
3. **Review process audit** — Review content approval process
4. **Parent notification** — Notify affected parents (if content was accessed)
5. **Corrective action** — Update content approval process to prevent recurrence
6. **Documentation** — Document incident and response

**Timeline:**
- **0-24 hours:** Content removed
- **24-48 hours:** Investigation completed
- **48-72 hours:** Parent notification sent (if applicable)
- **1-2 weeks:** Corrective action implemented
- **Ongoing:** Documentation updated

### 11.2 What Happens If a Child Accesses Inappropriate Content

**Scenario:** A child accesses inappropriate content (e.g., due to age filter error, parent override).

**Response:**
1. **Parent notification** — Notify parent immediately
2. **Content review** — Review content child accessed
3. **Parent guidance** — Provide guidance to parent on how to discuss with child
4. **Investigation** — Determine how child accessed inappropriate content
5. **Corrective action** — Update age filters or parental controls to prevent recurrence
6. **Documentation** — Document incident and response

**Timeline:**
- **0-1 hour:** Parent notified
- **1-24 hours:** Content reviewed
- **24-48 hours:** Parent guidance provided
- **1-2 weeks:** Corrective action implemented

### 11.3 Reporting Mechanism for Parents

**Requirement:** Parents must be able to report concerns easily.

**Implementation:**
- "Report Concern" button in parent dashboard
- Report form includes:
  - Child profile affected
  - Content type (lesson, story, activity)
  - Description of concern
  - Screenshot (optional)
- Report submitted to NOOR team
- Parent receives confirmation email
- Parent receives update on resolution

**Response:**
- **0-24 hours:** Report acknowledged
- **1-7 days:** Report investigated
- **7-14 days:** Resolution communicated to parent

### 11.4 Response Timeline

**Critical Incidents (e.g., child safety risk):**
- **0-1 hour:** Immediate response
- **1-24 hours:** Resolution implemented

**High-Priority Incidents (e.g., inappropriate content):**
- **0-24 hours:** Content removed
- **1-7 days:** Investigation completed

**Medium-Priority Incidents (e.g., bug in age filter):**
- **1-7 days:** Bug fixed
- **7-14 days:** Update deployed

**Low-Priority Incidents (e.g., parent feedback):**
- **7-14 days:** Feedback reviewed
- **14-30 days:** Improvement implemented (if applicable)

### 11.5 Documentation Requirements

**Requirement:** All incidents must be documented.

**Documentation Includes:**
- Incident description
- Date and time discovered
- Content affected
- Child profiles affected (if applicable)
- Response actions taken
- Timeline of response
- Root cause analysis
- Corrective actions implemented
- Lessons learned

**Storage:**
- Incident reports stored securely (encrypted, access-controlled)
- Retained for minimum 3 years (legal requirement)
- Available for audit by legal counsel or regulators

---

## 12. Review and Audit

### 12.1 Regular Content Review Schedule

**Requirement:** All NOOR content must be reviewed regularly to ensure ongoing appropriateness.

**Schedule:**
- **Annual review:** All content reviewed annually
- **Triggered review:** Content reviewed when parent reports concern
- **Update review:** Content reviewed when updated or modified

**Review Process:**
1. Content reviewed by child development expert
2. Content reviewed by Islamic scholar
3. Content approved, revised, or removed
4. Review documented

### 12.2 Safety Audit Frequency

**Requirement:** NOOR must undergo regular safety audits.

**Schedule:**
- **Pre-launch audit:** Comprehensive safety audit before NOOR launch
- **Annual audit:** Comprehensive safety audit annually
- **Triggered audit:** Audit when incident occurs

**Audit Scope:**
- Content appropriateness
- Data privacy compliance
- Technical security
- Parental controls effectiveness
- Incident response readiness

**Audit Conducted By:**
- Internal team (product, engineering, editorial)
- External auditor (optional, recommended)
- Legal counsel (for regulatory compliance)

### 12.3 Parent Feedback Mechanism

**Requirement:** Parents must be able to provide feedback easily.

**Implementation:**
- "Feedback" button in parent dashboard
- Feedback form includes:
  - Rating (1-5 stars)
  - Comments (free text)
  - Feature requests
  - Bug reports
- Feedback submitted to NOOR team
- Parent receives confirmation email

**Response:**
- Feedback reviewed monthly
- High-priority feedback addressed within 30 days
- Parent notified of improvements (if applicable)

### 12.4 Child Feedback Mechanism (Age-Appropriate)

**Requirement:** Children must be able to provide feedback in an age-appropriate way.

**Implementation:**
- **3-5 years:** Emoji-based feedback (happy face, neutral face, sad face)
- **6-8 years:** Simple rating (1-3 stars) + optional comment
- **9-12 years:** Rating (1-5 stars) + optional comment

**Design:**
- Feedback button always visible in NOOR interface
- Feedback is optional (child can skip)
- Feedback is anonymous (no personal data collected)

**Response:**
- Feedback reviewed monthly
- High-priority feedback addressed within 30 days

### 12.5 Continuous Improvement Process

**Requirement:** NOOR must continuously improve based on feedback and audits.

**Process:**
1. Collect feedback (parents and children)
2. Conduct regular audits
3. Analyze feedback and audit results
4. Identify areas for improvement
5. Prioritize improvements
6. Implement improvements
7. Communicate improvements to parents

**Documentation:**
- Improvement log maintained
- Changes documented
- Impact measured (if applicable)

---

## 13. Open Questions

The following questions require stakeholder decisions before NOOR implementation can begin:

### Q-1: Parent-Mediated or Direct Access?

**Question:** Should NOOR be parent-mediated (parent creates profile, provides consent) or directly accessible (child can access without parent setup)?

**Recommendation:** Parent-mediated with explicit consent.

**Rationale:**
- Meets legal requirements (verifiable parental consent)
- Ensures parent awareness and oversight
- Reduces safety risks

**Impact:**
- Affects NOOR onboarding flow
- Affects parental consent mechanism
- Affects parent dashboard design

**Decision Required:** ⏳ PENDING

### Q-7: Which Age Groups at Launch?

**Question:** Which age groups should be included in NOOR at launch?

**Options:**
- **Option A:** 6-8 years only (recommended)
- **Option B:** 9-12 years only
- **Option C:** All age groups (3-12)

**Recommendation:** Option A (6-8 years) for initial launch, then expand.

**Rationale:**
- Reduces complexity and safety risk
- Allows focused testing
- Lower development cost

**Impact:**
- Affects content filtering
- Affects UI design
- Affects developmental considerations

**Decision Required:** ⏳ PENDING

### Additional Open Questions

**What parental controls are essential vs. nice-to-have?**
- Essential: Content filtering, time limits, profile management, data deletion
- Nice-to-have: Detailed analytics, social features, external content approval
- **Decision Required:** ⏳ PENDING

**How to verify parental consent technically?**
- Proposed: Email plus additional step (e.g., SMS code)
- **Legal Review Required:** Legal counsel must confirm this meets COPPA and GDPR-K requirements
- **Decision Required:** ⏳ PENDING

**What child development experts should review content?**
- Need to identify qualified child development experts
- Need to establish review process
- **Decision Required:** ⏳ PENDING

**What Islamic scholars should review content?**
- Need to identify qualified Islamic scholars
- Need to establish review process
- **Decision Required:** ⏳ PENDING

---

## 14. Approval Requirements

### 14.1 Required Approvals

This specification must be approved by the following stakeholders before NOOR implementation can begin:

| Stakeholder | Approval Required | Status |
|-------------|-------------------|--------|
| **Product Owner** | Overall specification approval | ⏳ PENDING |
| **Legal Counsel** | Regulatory compliance (COPPA, GDPR-K, UK Code) | ⏳ PENDING |
| **Child Development Expert** | Age-appropriateness and safety | ⏳ PENDING |
| **Islamic Scholar** | Content appropriateness and religious accuracy | ⏳ PENDING |

### 14.2 Approval Process

1. **Specification Review:** Each stakeholder reviews this specification
2. **Feedback Collection:** Stakeholders provide feedback and requested changes
3. **Specification Revision:** Specification revised based on feedback
4. **Re-Review:** Stakeholders review revised specification
5. **Approval:** Stakeholders provide formal approval
6. **Documentation:** Approval documented and recorded

### 14.3 Approval Documentation

**Required:**
- Signed approval from each stakeholder
- Approval date
- Approval version (specification version)
- Any conditions or caveats

**Storage:**
- Approval documentation stored securely
- Available for audit by regulators
- Retained for minimum 3 years

### 14.4 NOOR Implementation Blocked

**NOOR implementation is BLOCKED until all approvals are received.**

No source code, components, routes, or features for NOOR may be implemented until:
- ✅ Product owner approval received
- ✅ Legal counsel approval received
- ✅ Child development expert approval received
- ✅ Islamic scholar approval received
- ✅ All open questions (Q-1, Q-7) resolved

---

## 15. Authorization Boundary

### 15.1 What This Specification Does

- ✅ Defines child-safety and privacy requirements for NOOR
- ✅ Specifies legal and regulatory compliance requirements
- ✅ Defines content safety requirements
- ✅ Specifies interaction design safety requirements
- ✅ Defines technical safety measures
- ✅ Specifies accessibility requirements
- ✅ Defines parent dashboard requirements
- ✅ Specifies incident response procedures
- ✅ Defines review and audit processes
- ✅ Identifies open questions requiring stakeholder decisions
- ✅ Specifies approval requirements

### 15.2 What This Specification Does NOT Do

- ❌ Authorize NOOR implementation
- ❌ Define specific features or user flows
- ❌ Replace legal counsel review
- ❌ Replace expert content review
- ❌ Address FAHM or EXPLORE modes
- ❌ Provide legal advice
- ❌ Guarantee regulatory compliance (legal counsel must confirm)

### 15.3 Next Steps

1. **Stakeholder Review:** Stakeholders review this specification
2. **Feedback Collection:** Stakeholders provide feedback
3. **Specification Revision:** Specification revised based on feedback
4. **Open Question Resolution:** Q-1 and Q-7 resolved
5. **Approval:** All stakeholders approve specification
6. **Implementation Planning:** NOOR implementation planned (only after all approvals)

### 15.4 Implementation Status

**NOOR Implementation:** ❌ NOT AUTHORIZED

**Blocked By:**
- ⏳ Specification approval (product owner, legal counsel, child development expert, Islamic scholar)
- ⏳ Open question resolution (Q-1, Q-7)

---

## Acceptance Criteria

This specification is ready for stakeholder approval when:

- [ ] Legal and regulatory framework clearly defined
- [ ] Age range and developmental stages specified
- [ ] Parental consent and mediation mechanisms defined
- [ ] Data collection minimization principles established
- [ ] Content safety requirements specified
- [ ] Interaction design safety requirements defined
- [ ] Technical safety measures specified
- [ ] Accessibility requirements defined
- [ ] Parent dashboard requirements specified
- [ ] Incident response procedures defined
- [ ] Review and audit processes established
- [ ] Open questions identified and visible
- [ ] Approval requirements clearly stated
- [ ] Authorization boundary explicitly defined
- [ ] No implementation authorized

---

## Approval Checklist

| Approval | Stakeholder | Status | Date | Notes |
|----------|-------------|--------|------|-------|
| Specification Review | Product Owner | ⏳ PENDING | | |
| Regulatory Compliance | Legal Counsel | ⏳ PENDING | | |
| Age-Appropriateness | Child Development Expert | ⏳ PENDING | | |
| Content Appropriateness | Islamic Scholar | ⏳ PENDING | | |
| Q-1 Resolution | Product Owner | ⏳ PENDING | | Parent-mediated or direct access? |
| Q-7 Resolution | Product Owner | ⏳ PENDING | | Which age groups at launch? |
| Implementation Authorization | Product Owner | ⏳ PENDING | | After all approvals received |

---

## Conclusion

This document specifies the child-safety and privacy requirements for NOOR, the children's mode (ages 3-12) of the Al-Huda Quran study application. The specification:

- ✅ Defines legal and regulatory compliance requirements (COPPA, GDPR-K, UK Code)
- ✅ Specifies age range and developmental considerations
- ✅ Defines parental consent and mediation mechanisms
- ✅ Establishes data collection minimization principles
- ✅ Specifies content safety requirements
- ✅ Defines interaction design safety requirements
- ✅ Specifies technical safety measures
- ✅ Establishes accessibility requirements
- ✅ Defines parent dashboard requirements
- ✅ Specifies incident response procedures
- ✅ Establishes review and audit processes
- ✅ Identifies open questions requiring stakeholder decisions
- ✅ Specifies approval requirements
- ✅ Explicitly defines authorization boundary (NOOR implementation blocked)

**Next Steps:**
1. Stakeholder review of this specification
2. Feedback collection and specification revision
3. Resolution of open questions (Q-1, Q-7)
4. Approval by all stakeholders (product owner, legal counsel, child development expert, Islamic scholar)
5. NOOR implementation planning (only after all approvals received)

**Authorization Status:** This is a specification for stakeholder review, not an implementation authorization. NOOR implementation is BLOCKED until all approvals are received.

---

**Document prepared by:** Automated quality review  
**Date:** November 11, 2026  
**Status:** Draft — Pending Stakeholder Review AND Legal/Expert Review