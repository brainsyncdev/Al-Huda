# Mode Navigation Specification

**Document Status:** Draft — Pending Stakeholder Review  
**Date:** November 11, 2026  
**Baseline:** PRD v4.1 / Sprint 54  
**Decision Reference:** STAKEHOLDER-DECISION-2026-11-11.md  
**Related Specification:** THREE-MODE-ARCHITECTURE.md  
**Purpose:** Specify how users navigate between NOOR, FAHM, and EXPLORE modes, how mode preferences are stored, and how the mode selector works

---

## Executive Summary

This document specifies the navigation, switching, and preference behavior for Al-Huda's three-mode product architecture. It resolves open questions Q-3 (free mode switching) and Q-6 (local mode preference storage) with concrete recommendations, and provides the design blueprint for the mode selector, onboarding flow, URL structure, and state persistence.

**Key Decisions (Recommendations):**

- **Free switching (Q-3):** Users may switch between NOOR, FAHM, and EXPLORE freely at any time via a persistent mode selector. No confirmation, no friction, no identity lock-in.
- **Local preference (Q-6):** Mode preference stored in a single `localStorage` key (`alhuda.selected-mode.v1`). Changeable at any time. Not a permanent identity label.
- **Default mode:** FAHM (continues current product behavior — D-04).
- **No accounts (D-09):** Mode selection does not require, create, or assume an account.
- **No identity assumptions:** Onboarding language is task-oriented ("I want to study the Quran deeply"), not identity-labeled ("I am a Muslim").

**Authorization Status:** This is a specification for stakeholder review, not an implementation authorization.

---

## 1. Mode Selection Flow

### 1.1 First-Time User Onboarding

When a user visits Al-Huda for the first time (no `alhuda.selected-mode.v1` key and no `alhuda.onboarding-seen.v1` key), they see a two-step onboarding flow:

```
┌──────────────────────────────────────────────────────────┐
│  Step 1: Welcome Screen                                  │
│  ─────────────────────                                   │
│  "Welcome to Al-Huda"                                    │
│                                                          │
│  Brief explanation of Al-Huda:                           │
│  "A Quran study experience for everyone. Choose the      │
│   path that fits where you are right now."                │
│                                                          │
│  [Continue]  [Skip — take me to FAHM]                    │
└──────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────┐
│  Step 2: Mode Selection Screen                           │
│  ─────────────────────                                   │
│  Three cards, each with:                                 │
│    • Mode name (Arabic + English)                        │
│    • One-line audience description                       │
│    • Two or three bullet features                        │
│    • "Start with [Mode]" button                          │
│                                                          │
│  [Skip — take me to FAHM]                                │
└──────────────────────────────────────────────────────────┘
```

### 1.2 Mode Selection Screen Content

Each mode card presents task-oriented language:

| Mode | Arabic | Audience Line | Feature Bullets |
|------|--------|---------------|-----------------|
| **NOOR** | نور | "For young learners (ages 7–12)" | • Age-appropriate stories and lessons  • Audio-supported learning  • Parent-controlled progress |
| **FAHM** | فهم | "For deeper Quran study" | • Word-by-word analysis  • Curated topics and Study Journeys  • Bookmarks, notes, and collections |
| **EXPLORE** | کشف | "For curious visitors and seekers" | • Beginner-friendly topic introductions  • Common questions answered  • Guided reading paths |

### 1.3 Skip Behavior

- The "Skip" button is always visible and equally prominent to the selection buttons.
- Skipping sets `alhuda.selected-mode.v1 = "fahm"` and `alhuda.onboarding-seen.v1 = true`.
- Skipping is not penalized; the user can switch modes later.

### 1.4 No Account, No Identity

- No email, name, or demographic information is collected during onboarding.
- No "I am a Muslim" / "I am a seeker" identity labels are stored.
- The mode choice is a **preference**, not a profile attribute.

---

## 2. Mode Selector UI

### 2.1 Location

**Recommended:** The mode selector lives in the **global header**, visible on every page in every mode.

**Rationale:**
- Header is always visible (unlike sidebar, which collapses on mobile).
- Header is the conventional location for cross-cutting navigation (language, theme).
- A sidebar placement would force mobile users to open a drawer to switch modes.

**Alternative considered:** Sidebar placement. Rejected because it is hidden on mobile and less discoverable.

### 2.2 Visual Design

```
┌─────────────────────────────────────────────────────────────────────┐
│  Al-Huda   [Quran] [Topics] [Journeys] [My Study]     ┌─────────┐ │
│                                                       │ FAHM ▾  │ │
│                                                       │  NOOR   │ │
│                                                       │  EXPLORE│ │
│                                                       └─────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

- **Closed state:** Shows current mode name with a dropdown chevron.
- **Open state:** Dropdown lists all three modes. Current mode is marked with a check icon and bold text.
- **Color coding (optional, subject to design review):** Each mode may carry a subtle accent color to reinforce which mode is active.
- **Iconography:** Each mode may carry a small icon (moon for NOOR, book for FAHM, compass for EXPLORE) — pending design decision.

### 2.3 Accessibility

- **Keyboard navigation:** The selector is a standard `<button>` + `<menu>` pattern. Arrow keys move between options; Enter/Space selects; Escape closes.
- **Screen reader:** The button announces "Current mode: FAHM. Press to change mode." Each option announces its name and description. Selection announces "Mode changed to EXPLORE."
- **Focus management:** When the dropdown opens, focus moves to the first option. When it closes, focus returns to the trigger button.
- **ARIA attributes:** `aria-haspopup="menu"`, `aria-expanded`, `aria-activedescendant` on the trigger; `role="menuitemradio"` on each option.

### 2.4 Mobile Responsiveness

- On mobile viewports (< 768px), the selector collapses to an icon + short label (e.g., "FAHM ▾").
- The dropdown becomes a bottom sheet on mobile for easier thumb reach.
- Touch target is at least 44×44px.

### 2.5 Mode Selector States

| State | Visual | Behavior |
|-------|--------|----------|
| Default | Current mode label + chevron | Click opens dropdown |
| Hover | Subtle background highlight | Cursor changes to pointer |
| Open | Dropdown visible, current mode checked | Click outside or Escape closes |
| Keyboard focus | Visible focus ring (2px solid) | Arrow keys navigate options |
| Disabled (future) | Greyed out, no chevron | Only if a mode is temporarily unavailable (see §12) |

---


## 3. Mode Switching Behavior

### 3.1 Free Switching (Q-3)

Users may switch modes at any time:
- No confirmation dialog
- No cooldown period
- No limit on number of switches
- No identity verification

### 3.2 Position Preservation

When switching modes, the application preserves the user's **Quranic position** where possible:

| Current Location | Switch To | Result |
|------------------|-----------|--------|
| FAHM: Surah Al-Baqarah, ayah 255 | EXPLORE | EXPLORE opens to Surah Al-Baqarah, ayah 255 (if EXPLORE has a Quran view) |
| FAHM: Topic page ("Patience") | EXPLORE | EXPLORE opens to its own "Patience" topic page (if one exists) |
| FAHM: Study Journey stage 3 | NOOR | NOOR opens to its home page (journeys are FAHM-specific) |
| EXPLORE: Reading path "Who is God?" | FAHM | FAHM opens to its home page (reading paths are EXPLORE-specific) |

**Rule:** Quranic coordinates (surah + ayah) are preserved. Mode-specific coordinates (journey stage, reading path step) are not — the user lands on the target mode's home or closest equivalent.

### 3.3 Personal Data Preservation

Switching modes **does not** clear:
- Bookmarks (`alhuda.bookmarks.v1`)
- Notes (`alhuda.notes.v1`)
- Collections (`alhuda.collections.v1`)
- Study journey progress (`alhuda.journey-progress.v1`)
- Translation preferences
- Any other personal data

Personal data is mode-agnostic. A bookmark created in FAHM is accessible when the user returns to FAHM later, regardless of how many times they switched modes in between.

### 3.4 Instantaneous Switching

- Mode switching must complete in **< 100ms** (see §14).
- No full page reload.
- Implemented via React state update + client-side route change.
- Shared components (Quran text viewer, surah selector) remain mounted; only mode-specific chrome changes.

### 3.5 Deep Links Across Modes

- A URL like `/explore/topics/patience` works regardless of the user's current mode.
- Opening a deep link does **not** change the user's stored mode preference — it simply renders that page in its native mode.
- The mode selector updates to reflect the mode of the current page.

### 3.6 Back Button Behavior

- The browser back button navigates through the user's **history stack**, which includes mode switches.
- Example: User is in FAHM → switches to EXPLORE → clicks a topic → presses Back → returns to EXPLORE home → presses Back → returns to FAHM page they were on.
- This is the expected web behavior and requires no special handling beyond correct use of the Next.js router.

---


## 4. Mode Preference Storage

### 4.1 localStorage Key

| Key | Type | Values | Default |
|-----|------|--------|---------|
| `alhuda.selected-mode.v1` | string | `"noor"` \| `"fahm"` \| `"explore"` | `"fahm"` |

### 4.2 Semantics

- The value is a **preference**, not an identity.
- It can be changed at any time via the mode selector.
- It can be cleared (e.g., by clearing browser data), in which case the application falls back to the default (`"fahm"`).
- It is **not** synced across devices (no accounts — D-09).
- It is **not** sent to any server.

### 4.3 Invalid Values

If `alhuda.selected-mode.v1` contains a value other than `"noor"`, `"fahm"`, or `"explore"`:
- The application treats it as unset.
- The default (`"fahm"`) is used.
- The invalid value is overwritten with the default on next write.

### 4.4 Versioning

The `.v1` suffix allows future schema changes without breaking existing users. If a future version changes the key format, migration logic will read `.v1` and write `.v2`.

---


## 5. Mode Context Management

### 5.1 React Context Provider

A single `ModeProvider` wraps the entire application:

```typescript
// src/lib/modes/ModeContext.tsx
interface ModeContextValue {
  mode: 'noor' | 'fahm' | 'explore';
  setMode: (mode: 'noor' | 'fahm' | 'explore') => void;
  preferences: ModePreferences;
  updatePreferences: (prefs: Partial<ModePreferences>) => void;
}

const ModeContext = createContext<ModeContextValue | null>(null);

export function ModeProvider({ children }: { children: React.ReactNode }) {
  // Reads alhuda.selected-mode.v1 on mount
  // Writes on setMode()
  // Provides mode + preferences to descendants
}

export function useMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error('useMode must be used within ModeProvider');
  return ctx;
}
```

### 5.2 What Belongs in Mode Context

| In Mode Context | Not in Mode Context (use shared services) |
|-----------------|--------------------------------------------|
| Current mode identifier | Quran text |
| Mode-specific UI state (e.g., NOOR audio preferences) | Translation editions |
| Mode-specific preferences (e.g., EXPLORE glossary toggle) | Topic data |
| Onboarding completion flag | Study journey data |

### 5.3 Shared Data Access

Shared data is accessed through services, not through mode context:

```typescript
// Correct: shared service
import { getTopic } from '@/lib/topics/data';
const topic = getTopic('patience');

// Incorrect: mode context does not hold shared data
const { topic } = useMode(); // ❌ topic is not in mode context
```

### 5.4 Mode-Specific State Isolation

Each mode may maintain its own UI state (filters, search queries, expanded panels). This state is:
- Stored in mode-specific React state (not global context).
- Lost when the user navigates away from that mode's pages (acceptable — see §11).
- Not shared with other modes.

---


## 6. Navigation Structures Per Mode

### 6.1 NOOR Navigation

| Section | Purpose |
|---------|---------|
| Home | Welcome, today's lesson, progress |
| Learn | Age-appropriate lessons |
| Stories | Quranic stories with audio |
| Activities | Interactive exercises |
| Parent Area | Separate, requires parent authentication (see NOOR-CHILD-SAFETY-SPECIFICATION.md) |

**Note:** NOOR is not yet implemented (blocked by D-07). Navigation structure is provisional.

### 6.2 FAHM Navigation

| Section | Purpose |
|---------|---------|
| Quran | Read, tilawat, translation selection |
| Learn | Functional area (D-06): word-by-word, roots, morphology |
| Topics | Curated topics and life dimensions |
| Roots | Root and lemma exploration |
| Study Journeys | Structured learning paths |
| My Study | Bookmarks, notes, collections, history |

**Note:** FAHM is the current product. This navigation largely reflects existing structure.

### 6.3 EXPLORE Navigation

| Section | Purpose |
|---------|---------|
| Discover | Beginner-friendly entry points, featured content |
| Questions | Common questions and misconceptions |
| Topics | Simplified topic introductions |
| Reading Paths | Guided exploration for newcomers |
| Quran | Access to Quran text (with beginner-friendly framing) |

**Note:** EXPLORE is not yet implemented. Navigation structure is provisional.

---


## 7. Cross-Mode Navigation

### 7.1 Shared Quran Navigation

The surah/ayah selector is a shared component that works identically in all modes:
- User can jump to any surah and ayah from any mode.
- The selector does not change appearance across modes (though surrounding chrome may).
- Quranic coordinates are preserved across mode switches (§3.2).

### 7.2 Deep Links

Every page in every mode has a stable URL:
- `/noor/stories/yusuf`
- `/fahm/quran/2/255`
- `/explore/topics/patience`

Deep links work regardless of the user's stored mode preference.

### 7.3 Related Content Links

Content may link across mode boundaries:
- A FAHM topic page may say: "New to this topic? See the EXPLORE introduction →"
- An EXPLORE reading path may say: "Want to go deeper? See the FAHM study journey →"

Cross-mode links:
- Open in the target mode.
- Do **not** change the user's stored mode preference.
- Are clearly labeled as crossing into a different mode.

### 7.4 Search Behavior

- Search is a shared service.
- Search results may include content from multiple modes.
- Each result is labeled with its mode (e.g., "FAHM · Topic: Patience").
- Clicking a result navigates to that page in its native mode.

---


## 8. Onboarding Flow

### 8.1 First-Visit Detection

```
On app load:
  if localStorage has no 'alhuda.onboarding-seen.v1':
    show onboarding flow
  else:
    proceed to stored mode (or default FAHM)
```

### 8.2 Onboarding Steps

1. **Welcome screen** — Brief explanation of Al-Huda. No personal information collected.
2. **Mode selection screen** — Three cards with task-oriented descriptions (§1.2).
3. **Optional preview** — User may preview one page from their selected mode before confirming (future enhancement, not in initial implementation).
4. **Completion** — Set `alhuda.selected-mode.v1` and `alhuda.onboarding-seen.v1 = true`. Navigate to mode home.

### 8.3 Skip Option

- "Skip" is always available on both onboarding screens.
- Skipping defaults to FAHM.
- Skipping is not penalized or discouraged.

### 8.4 No Account, No Data Collection

- No email, name, age, or demographic fields.
- No "Create account" or "Sign in" prompts.
- No analytics or tracking consent (unless separately authorized).

---


## 9. URL Structure

### 9.1 Proposed URL Patterns

| Mode | URL Pattern | Example |
|------|-------------|---------|
| NOOR | `/noor/...` | `/noor/stories/yusuf` |
| FAHM | `/fahm/...` | `/fahm/quran/2/255` |
| EXPLORE | `/explore/...` | `/explore/topics/patience` |

### 9.2 Mode Prefix

- Every mode-specific page carries a mode prefix.
- The prefix matches the mode identifier in `alhuda.selected-mode.v1`.

### 9.3 Shared URLs

Some URLs are mode-agnostic:
- `/quran/2/255` — Redirects to the Quran view in the user's current mode (e.g., `/fahm/quran/2/255` if mode is FAHM).
- `/search?q=patience` — Shared search, results labeled by mode.
- `/settings` — Shared settings (if any).

### 9.4 Deep Linking

- All URLs are stable and shareable.
- Opening a deep link does not change the stored mode preference.
- The mode selector reflects the mode of the current page.

### 9.5 SEO Considerations

- Public pages (especially EXPLORE) should be indexable by search engines.
- Meta tags (title, description, Open Graph) must be set per page.
- Quran text pages should carry appropriate schema.org markup.
- NOOR pages may be excluded from indexing (parent-controlled).

---


## 10. State Persistence

### 10.1 What Persists Across Mode Switches

| Data | Persists? | Storage Key |
|------|-----------|-------------|
| Bookmarks | ✅ Yes | `alhuda.bookmarks.v1` |
| Notes | ✅ Yes | `alhuda.notes.v1` |
| Collections | ✅ Yes | `alhuda.collections.v1` |
| Study journey progress | ✅ Yes | `alhuda.journey-progress.v1` |
| Translation preferences | ✅ Yes | `alhuda.translation-prefs.v1` |
| Quranic position (surah/ayah) | ✅ Yes | Session state (not localStorage) |

### 10.2 What Resets Per Mode

| Data | Resets? | Reason |
|------|---------|--------|
| Mode-specific UI state (filters, search queries) | ✅ Yes | Mode-specific, not shared |
| Expanded panels, open modals | ✅ Yes | UI state, not persistent |
| Mode-specific preferences (e.g., NOOR audio settings) | ✅ Yes | Only relevant in that mode |

### 10.3 What Is Mode-Specific

| Data | Mode-Specific? | Notes |
|------|----------------|-------|
| Mode preference | ✅ Yes | `alhuda.selected-mode.v1` |
| Onboarding completion | ✅ Yes | `alhuda.onboarding-seen.v1` |
| NOOR parental controls | ✅ Yes | Only relevant in NOOR |
| EXPLORE glossary toggle | ✅ Yes | Only relevant in EXPLORE |

### 10.4 localStorage Key Structure

```
alhuda.selected-mode.v1          → "noor" | "fahm" | "explore"
alhuda.onboarding-seen.v1        → true | false
alhuda.bookmarks.v1              → JSON array
alhuda.notes.v1                  → JSON array
alhuda.collections.v1            → JSON array
alhuda.journey-progress.v1       → JSON object
alhuda.translation-prefs.v1      → JSON object
```

All keys are versioned (`.v1`) to allow future schema migration.

---


## 11. Edge Cases

### 11.1 localStorage Cleared

- If `alhuda.selected-mode.v1` is missing, the application defaults to FAHM.
- If `alhuda.onboarding-seen.v1` is missing, the onboarding flow is shown again.
- Personal data (bookmarks, notes) is lost — this is expected behavior for local-first storage.

### 11.2 Direct Access to Mode-Specific URL

- If a user navigates directly to `/explore/topics/patience`:
  - The page renders in EXPLORE mode.
  - The mode selector shows "EXPLORE".
  - The stored mode preference is **not** changed.
  - If the user then clicks the mode selector and switches to FAHM, they return to FAHM.

### 11.3 NOOR Not Yet Implemented

- If NOOR is selected but not yet implemented:
  - The mode selector shows NOOR as "Coming soon" (greyed out).
  - Clicking NOOR shows a message: "NOOR is coming soon. You'll be notified when it's ready."
  - The user remains in their current mode.
  - Alternatively, the mode selector may hide NOOR entirely until it is implemented.

**Recommendation:** Grey out NOOR with a "Coming soon" label. This preserves awareness without breaking the experience.

### 11.4 EXPLORE Not Yet Implemented

- Same handling as NOOR (§11.3).

### 11.5 Invalid Mode Value

- If `alhuda.selected-mode.v1` contains an invalid value (e.g., `"unknown"`):
  - The application treats it as unset.
  - The default (`"fahm"`) is used.
  - The invalid value is overwritten on next write.

### 11.6 Multiple Tabs with Different Modes

- Each tab maintains its own session state (React state).
- If a user opens Tab A (FAHM) and Tab B (EXPLORE), they can switch modes independently in each tab.
- The stored mode preference (`alhuda.selected-mode.v1`) is shared across tabs (localStorage is shared).
- If the user switches modes in Tab A, Tab B does **not** automatically update (no cross-tab sync).
- On next page load, Tab B will read the updated preference.

**Recommendation:** Do not implement cross-tab sync. This adds complexity without clear user benefit.

---


## 12. Accessibility

### 12.1 Keyboard Navigation

- Mode selector is fully keyboard-navigable (§2.3).
- Mode switching can be triggered by keyboard (no mouse required).
- All mode-specific pages are keyboard-navigable.

### 12.2 Screen Reader Announcements

- When the mode changes, the application announces: "Mode changed to [Mode Name]."
- Implementation: Use an ARIA live region (`aria-live="polite"`) to announce mode changes.
- The mode selector button announces its current state: "Current mode: FAHM. Press to change mode."

### 12.3 Focus Management

- When the mode selector dropdown opens, focus moves to the first option.
- When the dropdown closes, focus returns to the trigger button.
- When a mode switch occurs, focus moves to the main content area of the new mode (to avoid disorientation).

### 12.4 High Contrast Mode

- The mode selector must be visible in high contrast mode.
- Mode-specific accent colors (if used) must meet WCAG 2.1 AA contrast requirements.

### 12.5 Reduced Motion

- Mode switching does not involve animation (instantaneous — §3.4).
- If future animations are added, they must respect `prefers-reduced-motion`.

---


## 13. Performance Considerations

### 13.1 Mode Switching Speed

- Mode switching must complete in **< 100ms**.
- This is achievable because:
  - No full page reload (client-side route change).
  - Shared components (Quran text viewer) remain mounted.
  - Only mode-specific chrome changes.

### 13.2 Lazy Loading

- Mode-specific components are lazy-loaded:
  - NOOR components are not loaded until the user enters NOOR.
  - EXPLORE components are not loaded until the user enters EXPLORE.
- This reduces initial bundle size.

### 13.3 Shared Component Caching

- Shared components (Quran text viewer, surah selector) are cached across mode switches.
- They are not unmounted and remounted on mode switch.

### 13.4 Re-Render Minimization

- Mode switching should not cause unnecessary re-renders of shared components.
- Implementation: Use React.memo and proper context segmentation to prevent cascading re-renders.

---


## 14. Open Questions

The following questions remain pending stakeholder decisions:

| ID | Question | Recommendation | Impact |
|----|----------|----------------|--------|
| Q-2 | Should EXPLORE require onboarding? | Minimal welcome screen, no account | Affects EXPLORE entry experience |
| — | Should mode selector be in header or sidebar? | Header (see §2.1) | Affects navigation design |
| — | Should there be a "home" page per mode? | Yes, each mode has a home page | Affects information architecture |
| — | How to handle users who want multiple modes open simultaneously? | Multiple tabs, no cross-tab sync (see §11.6) | Affects state management |

---


## 15. Acceptance Criteria

This specification is ready for stakeholder approval when:

- [ ] Mode selection flow clearly defined (onboarding, skip behavior, no identity assumptions)
- [ ] Mode selector UI specified (location, visual design, accessibility, mobile responsiveness)
- [ ] Mode switching behavior defined (free switching, position preservation, data preservation, instantaneous)
- [ ] Mode preference storage specified (localStorage key, values, default, invalid handling)
- [ ] Mode context management defined (React context, shared vs. mode-specific state)
- [ ] Navigation structures per mode outlined (NOOR, FAHM, EXPLORE)
- [ ] Cross-mode navigation specified (shared Quran navigation, deep links, related content, search)
- [ ] Onboarding flow detailed (first-visit detection, steps, skip option, no data collection)
- [ ] URL structure proposed (mode prefixes, shared URLs, deep linking, SEO)
- [ ] State persistence defined (what persists, what resets, what is mode-specific)
- [ ] Edge cases addressed (localStorage cleared, direct URL access, unimplemented modes, invalid values, multiple tabs)
- [ ] Accessibility requirements specified (keyboard navigation, screen reader, focus management, high contrast, reduced motion)
- [ ] Performance considerations outlined (switching speed, lazy loading, caching, re-render minimization)
- [ ] Open questions visible
- [ ] No implementation authorized

---


## 16. Authorization Boundary

### What Is Authorized

- ✅ Specification development (this document)
- ✅ Architecture direction (three-mode product — D-01 through D-08)
- ✅ Detailed design of mode navigation, switching, and preferences

### What Is NOT Authorized

- ❌ **Implementation authorization:** Not granted
- ❌ **Mode selector implementation:** Not authorized
- ❌ **Onboarding flow implementation:** Not authorized
- ❌ **URL structure changes:** Not authorized
- ❌ **localStorage schema changes:** Not authorized
- ❌ **Source code modifications:** Not authorized

### What Must Not Change

- No source code modifications
- No application functionality changes
- No Quranic data modifications
- No configuration changes

---


## Next Steps

1. **Stakeholder review** of this specification.
2. **Resolution of open questions** (Q-2, and any new questions raised during review).
3. **Approval** of this specification (or revision requests).
4. **Implementation planning** (only after all specifications approved).

---

**Document prepared by:** Automated quality review  
**Date:** November 11, 2026  
**Status:** Draft — Pending Stakeholder Review
