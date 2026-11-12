# FAHM Design System

**Version:** 1.0  
**Last Updated:** November 12, 2026  
**Status:** Documented from existing implementation (MFD-02B)

---

## Overview

The FAHM design system is built on a foundation of accessibility, semantic HTML, and cultural sensitivity for Arabic/Islamic content. This document captures the existing design tokens, components, and patterns that ensure visual consistency across the application.

**Core Principles:**
- **Accessibility-first:** WCAG 2.2 AA compliance, semantic HTML, keyboard navigation
- **Cultural sensitivity:** Proper Arabic typography, RTL support, respectful presentation of religious content
- **Transparency:** Provenance, editorial status, and data integrity always visible
- **Local-first:** No accounts, no cloud sync, privacy-preserving
- **Performance:** Zero CLS, lazy loading, hydration-safe patterns

---

## 1. Typography

### Font Stack

**Latin (English, Urdu, other non-Arabic):**
```css
font-family: 'Geist', system-ui, sans-serif;
```
- Loaded via `next/font/google` — zero CLS
- Weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- Used for: UI text, translations, metadata, navigation

**Arabic (Quran text, Arabic titles):**
```css
font-family: 'Amiri_Quran', 'Amiri', serif;
```
- Loaded via `next/font/google` — zero CLS
- Specifically optimized for Quranic text with full diacritics support
- Used for: Arabic Quran text, Arabic titles, Arabic metadata

**Display (Headings, emphasis):**
```css
font-family: 'Lora', serif;
```
- Used for: Page titles, section headings, emphasis text
- Provides visual distinction from body text

### Type Scale

**Arabic Text Sizes (Quran reading):**
| Size | rem | line-height | Use case |
|------|-----|-------------|----------|
| `arabic-sm` | 1.5rem | 2.4 | Compact reading, footnotes |
| `arabic-md` | 1.75rem | 2.3 | Default reading size |
| `arabic-lg` | 2.25rem | 2.2 | Emphasized verses |
| `arabic-xl` | 2.75rem | 2.1 | Hero verses, featured content |

**Note:** Line height decreases as size increases — correct for Arabic script to maintain readability with diacritics.

**Latin Text Sizes:**
| Token | rem | px | Use case |
|-------|-----|----|----------|
| `text-xs` | 0.75rem | 12px | Metadata, captions, badges |
| `text-sm` | 0.875rem | 14px | Secondary text, form labels |
| `text-base` | 1rem | 16px | Body text, default |
| `text-lg` | 1.125rem | 18px | Emphasized body, lead paragraphs |
| `text-xl` | 1.25rem | 20px | Section headings |
| `text-2xl` | 1.5rem | 24px | Page subtitles |
| `text-3xl` | 1.875rem | 30px | Page titles |
| `text-4xl` | 2.25rem | 36px | Hero titles |

**Font Weights:**
- `font-normal` (400) — Body text
- `font-medium` (500) — Emphasized text, labels
- `font-semibold` (600) — Headings, buttons
- `font-bold` (700) — Strong emphasis, CTAs

### Arabic Text Presentation

**CSS Classes:**
```css
.arabic-text {
  font-family: 'Amiri_Quran', serif;
  line-height: 2.2;
  direction: rtl;
  text-align: right;
}

.arabic-display {
  font-family: 'Amiri_Quran', serif;
  line-height: 2.2;
  direction: rtl;
  text-align: right;
  color: hsl(var(--gold));
}

.ayah-number {
  /* Ornamental ayah number marker */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2em;
  height: 2em;
  border-radius: 50%;
  background: hsl(var(--gold-soft));
  color: hsl(var(--gold));
  font-size: 0.75em;
  font-weight: 600;
}
```

**Usage:**
- Always add `lang="ar"` and `dir="rtl"` to Arabic text elements
- Use `.arabic-text` for Quranic verses and Arabic body text
- Use `.arabic-display` for Arabic titles and emphasized Arabic text
- Use `.ayah-number` for ornamental ayah reference markers

---

## 2. Color Palette

### Semantic Colors (HSL Variables)

**Base Colors:**
```css
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --card: 0 0% 100%;
  --card-foreground: 240 10% 3.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 240 10% 3.9%;
  --primary: 142 72% 29%;
  --primary-foreground: 355 100% 100%;
  --secondary: 240 4.8% 95.9%;
  --secondary-foreground: 240 5.9% 10%;
  --muted: 240 4.8% 95.9%;
  --muted-foreground: 240 3.8% 46.1%;
  --accent: 240 4.8% 95.9%;
  --accent-foreground: 240 5.9% 10%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 98%;
  --border: 240 5.9% 90%;
  --input: 240 5.9% 90%;
  --ring: 142 72% 29%;
  --radius: 0.5rem;
}
```

**Brand Colors:**
```css
:root {
  --gold: 45 93% 47%;
  --gold-soft: 45 93% 95%;
  --emerald-soft: 142 72% 95%;
}
```

**Color Usage:**
- `--primary` (emerald) — Primary actions, links, active states
- `--gold` — Arabic text, emphasis, brand accent
- `--gold-soft` — Arabic text backgrounds, highlighted matches
- `--emerald-soft` — Success states, positive indicators
- `--destructive` — Errors, destructive actions, warnings
- `--muted-foreground` — Secondary text, metadata, captions
- `--border` — Borders, dividers, separators

### Dark Mode (Currently Unreachable)

**Status:** Dark mode tokens are defined in `globals.css` but the theme toggle is not wired. The `<html>` element is hardcoded to `className="light"` in SSR.

**Action Required:** Wire theme toggle to enable dark mode (part of critical fix C1).

**Dark Mode Tokens:**
```css
.dark {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  --card: 240 10% 3.9%;
  --card-foreground: 0 0% 98%;
  --popover: 240 10% 3.9%;
  --popover-foreground: 0 0% 98%;
  --primary: 142 72% 49%;
  --primary-foreground: 144 100% 10%;
  --secondary: 240 3.7% 15.9%;
  --secondary-foreground: 0 0% 98%;
  --muted: 240 3.7% 15.9%;
  --muted-foreground: 240 5% 64.9%;
  --accent: 240 3.7% 15.9%;
  --accent-foreground: 0 0% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 0 0% 98%;
  --border: 240 3.7% 15.9%;
  --input: 240 3.7% 15.9%;
  --ring: 142 72% 49%;
}
```

---

## 3. Spacing Scale

**Base Unit:** 4px (0.25rem)

**Spacing Tokens:**
| Token | rem | px | Use case |
|-------|-----|----|----------|
| `space-1` | 0.25rem | 4px | Tight spacing, icon gaps |
| `space-2` | 0.5rem | 8px | Small gaps, inline elements |
| `space-3` | 0.75rem | 12px | Default inline spacing |
| `space-4` | 1rem | 16px | Default block spacing |
| `space-5` | 1.25rem | 20px | Section padding |
| `space-6` | 1.5rem | 24px | Card padding, section gaps |
| `space-8` | 2rem | 32px | Large section gaps |
| `space-10` | 2.5rem | 40px | Page section spacing |
| `space-12` | 3rem | 48px | Major section breaks |

**Usage Patterns:**
- **Card padding:** `p-5` (20px) or `p-6` (24px)
- **Section spacing:** `space-y-8` (32px) or `space-y-10` (40px)
- **Inline gaps:** `gap-2` (8px) or `gap-3` (12px)
- **Page container padding:** `px-4` (16px) on mobile, `px-6` (24px) on desktop

---

## 4. Layout & Containers

### Page Containers

**Standard Container:**
```tsx
<div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
  {/* Page content */}
</div>
```
- `max-w-5xl` (1024px) — Default content width
- Responsive padding: 16px mobile → 24px tablet → 32px desktop

**Narrow Container (Reading, Forms):**
```tsx
<div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
  {/* Reading content */}
</div>
```
- `max-w-3xl` (768px) — Optimized for reading comfort
- Used for: Quran reader, article content, forms

**Wide Container (Dashboards, Grids):**
```tsx
<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
  {/* Dashboard content */}
</div>
```
- `max-w-7xl` (1280px) — Wide layouts with multiple columns
- Used for: Dashboards, data tables, multi-column grids

### Grid Systems

**Responsive Grids:**
```tsx
{/* 1 column mobile → 2 columns tablet → 3 columns desktop */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Grid items */}
</div>

{/* 2 columns mobile → 3 columns tablet → 5 columns desktop */}
<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
  {/* Grid items */}
</div>
```

**Flex Wrapping (Tags, Pills):**
```tsx
<div className="flex flex-wrap gap-2">
  {/* Flexible items */}
</div>
```

---

## 5. Border Radius & Elevation

### Border Radius

**Tokens:**
| Token | Value | Use case |
|-------|-------|----------|
| `rounded-none` | 0 | Sharp corners (rare) |
| `rounded-sm` | 0.125rem | Subtle rounding |
| `rounded` | 0.25rem | Default buttons, inputs |
| `rounded-md` | 0.375rem | Cards, panels |
| `rounded-lg` | 0.5rem | Large cards, modals |
| `rounded-xl` | 0.75rem | Hero cards, featured content |
| `rounded-2xl` | 1rem | Primary card style |
| `rounded-full` | 9999px | Pills, badges, avatars |

**Standard Card:**
```tsx
<div className="rounded-2xl border border-border/80 bg-card p-5">
  {/* Card content */}
</div>
```

### Elevation (Shadows)

**Usage:** Minimal elevation — prefer borders over shadows for separation.

```css
/* Subtle elevation for floating elements */
.shadow-sm { box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); }

/* Default elevation for dropdowns, modals */
.shadow-md { box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }

/* Strong elevation for dialogs */
.shadow-lg { box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1); }
```

**Pattern:** Use `border border-border/80` for cards and panels. Reserve shadows for floating elements (dropdowns, modals, tooltips).

---

## 6. Buttons & Interactive States

### Button Variants

**Primary Button:**
```tsx
<button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
  Primary Action
</button>
```

**Secondary Button:**
```tsx
<button className="inline-flex items-center justify-center rounded-md border border-border bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
  Secondary Action
</button>
```

**Ghost Button:**
```tsx
<button className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
  Ghost Action
</button>
```

**Destructive Button:**
```tsx
<button className="inline-flex items-center justify-center rounded-md bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground hover:bg-destructive/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
  Destructive Action
</button>
```

### Touch Targets

**WCAG Compliance:** Minimum 44x44px touch target (WCAG 2.5.5).

**Mobile Navigation:**
```tsx
<button className="min-h-14 min-w-14"> {/* 56x56px — exceeds WCAG */}
  {/* Icon or label */}
</button>
```

**Standard Buttons:**
```tsx
<button className="h-11 px-4"> {/* 44px height — meets WCAG */}
  {/* Button label */}
</button>
```

**Note:** Default `h-9` (36px) in some components is below WCAG minimum. Increase to `h-11` (44px) for touch-friendly targets.

### Interactive States

**Focus Ring:**
```css
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
```
- Visible focus indicator for keyboard navigation
- Uses `--ring` color (primary emerald)
- 2px offset for clarity

**Hover States:**
- Buttons: `hover:bg-primary/90` (slight opacity change)
- Links: `hover:underline` or `hover:text-primary`
- Cards: `hover:border-border` (subtle border emphasis)

**Disabled States:**
```css
disabled:pointer-events-none disabled:opacity-50
```
- Prevents interaction
- Reduces opacity to 50%

---

## 7. Cards, Lists & Panels

### Standard Card

```tsx
<div className="rounded-2xl border border-border/80 bg-card p-5">
  <h3 className="font-display text-lg font-semibold">Card Title</h3>
  <p className="mt-2 text-sm text-muted-foreground">Card description</p>
  <div className="mt-4">
    {/* Card actions */}
  </div>
</div>
```

**Card Variations:**
- **Hover effect:** Add `hover:border-border transition-colors`
- **Clickable:** Add `cursor-pointer` and wrap in `<Link>`
- **Featured:** Use `bg-gold-soft border-gold/40` for emphasis

### List Items

```tsx
<ul className="space-y-2">
  <li className="flex items-start gap-2">
    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
    <span className="text-sm">List item text</span>
  </li>
</ul>
```

### Panels (Collapsible Sections)

```tsx
<div className="rounded-2xl border border-border/80 bg-card">
  <button
    className="flex w-full items-center justify-between p-5 text-left"
    aria-expanded={isOpen}
  >
    <span className="font-semibold">Panel Title</span>
    <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
  </button>
  {isOpen && (
    <div className="border-t border-border/80 p-5">
      {/* Panel content */}
    </div>
  )}
</div>
```

**Pattern:** Always use `aria-expanded` on collapsible triggers.

---

## 8. Inputs, Selectors & Search Fields

### Text Input

```tsx
<input
  type="text"
  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
  placeholder="Enter text"
/>
```

**Height:** `h-11` (44px) — meets WCAG touch target minimum.

### Select Dropdown

```tsx
<select className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
  <option value="">Select option</option>
  <option value="1">Option 1</option>
</select>
```

### Search Box (Combobox Pattern)

```tsx
<div className="relative">
  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
  <input
    role="combobox"
    aria-expanded={isOpen}
    aria-controls="suggestions-list"
    aria-activedescendant={activeDescendant}
    className="flex h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    placeholder="Search..."
  />
  {isOpen && (
    <ul id="suggestions-list" role="listbox" className="absolute top-full mt-2 w-full rounded-md border border-border bg-popover shadow-md">
      {/* Suggestions */}
    </ul>
  )}
</div>
```

**Pattern:** Full WAI-ARIA combobox with keyboard navigation (ArrowUp/Down, Enter, Escape).

---

## 9. Dialogs, Dropdowns & Tooltips

### Dialog (Modal)

```tsx
<Dialog>
  <DialogTrigger asChild>
    <button>Open Dialog</button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Dialog description</DialogDescription>
    </DialogHeader>
    <div className="py-4">
      {/* Dialog content */}
    </div>
    <DialogFooter>
      <DialogClose asChild>
        <button className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Save</button>
      </DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**Pattern:** Radix-based Dialog with focus trap, Escape-to-close, and proper ARIA attributes.

### Dropdown Menu

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <button>Open Menu</button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end" className="w-56">
    <DropdownMenuItem>Item 1</DropdownMenuItem>
    <DropdownMenuItem>Item 2</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Destructive</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

**RTL Note:** Use logical positioning (`align="start"` / `align="end"`) instead of physical (`left` / `right`) for RTL support.

### Tooltip

```tsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <button>Hover me</button>
    </TooltipTrigger>
    <TooltipContent>
      <p>Tooltip text</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

---

## 10. Responsive Breakpoints

### Breakpoint Tokens

| Token | Width | Use case |
|-------|-------|----------|
| `sm` | 640px | Tablet portrait |
| `md` | 768px | Tablet landscape |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Large desktop |
| `2xl` | 1536px | Ultrawide |

### Responsive Patterns

**Mobile-First:**
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
  {/* 1 col mobile → 2 col tablet → 3 col desktop */}
</div>
```

**Hide/Show:**
```tsx
<div className="hidden sm:block">
  {/* Visible on tablet and up */}
</div>

<div className="sm:hidden">
  {/* Visible only on mobile */}
</div>
```

**Navigation:**
- **Mobile (< 768px):** Slim header + bottom navigation (5 tabs)
- **Desktop (≥ 768px):** Full header with primary navigation

---

## 11. RTL Support

### Logical Properties

**Use logical properties for RTL compatibility:**
```css
/* ✅ Good — mirrors in RTL */
margin-inline-start: 1rem;
padding-inline-end: 1rem;
left: 0; /* Use start-0 instead */

/* ❌ Avoid — doesn't mirror */
margin-left: 1rem;
padding-right: 1rem;
```

**Tailwind Logical Classes:**
```tsx
<div className="ms-4 pe-4 start-0">
  {/* ms = margin-start, pe = padding-end, start = left in LTR / right in RTL */}
</div>
```

### Forced LTR Elements

Some elements should remain LTR even in RTL context:
```tsx
<div dir="ltr" className="...">
  {/* Code, search queries, URLs */}
</div>
```

### RTL-Specific Styles

```css
[dir="rtl"] .flip-rtl {
  transform: scaleX(-1);
}
```

Use for icons that should flip in RTL (e.g., arrows, chevrons).

---

## 12. Accessibility Patterns

### Skip Link

```tsx
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
>
  Skip to main content
</a>
```

### Focus Management

**Visible Focus:**
```css
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
```

**Focus Trap (Dialogs):**
- Radix Dialog handles focus trap automatically
- Tab/Shift+Tab cycles within dialog
- Escape returns focus to trigger

### ARIA Patterns

**Collapsible Sections:**
```tsx
<button aria-expanded={isOpen} aria-controls="section-id">
  Toggle
</button>
<div id="section-id" hidden={!isOpen}>
  {/* Content */}
</div>
```

**Active Navigation:**
```tsx
<Link aria-current="page" href="/current-page">
  Current Page
</Link>
```

**Live Regions:**
```tsx
<div aria-live="polite" className="sr-only">
  {announcement}
</div>
```

### Color Contrast

**WCAG 2.2 AA Requirements:**
- Normal text: 4.5:1 contrast ratio
- Large text (18px+ or 14px bold): 3:1 contrast ratio

**Verified Pairs:**
- `--foreground` on `--background`: 16.5:1 ✅
- `--primary-foreground` on `--primary`: 4.6:1 ✅
- `--muted-foreground` on `--background`: 5.2:1 ✅

### Match Highlighting (Not Color- Alone)

```tsx
<span className="bg-gold-soft font-semibold underline">
  {/* Highlighted text */}
</span>
```

Three redundant signals: background color, font weight, underline. Meets WCAG 1.4.1.

---

## 13. Animation & Motion

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Pattern:** Respect `prefers-reduced-motion` globally. All animations and transitions are disabled when user prefers reduced motion.

### Transitions

```css
transition-colors /* For color changes */
transition-transform /* For transforms */
transition-all /* For multiple properties (use sparingly) */
```

**Duration:** Default 150ms for UI transitions, 300ms for larger animations.

---

## 14. Iconography

### Icon Library

**Lucide React:** Primary icon library
```tsx
import { Search, ChevronDown, X } from 'lucide-react';
```

### Icon Sizing

| Context | Size | Class |
|---------|------|-------|
| Inline with text | 16px | `h-4 w-4` |
| Buttons | 20px | `h-5 w-5` |
| Headings | 24px | `h-6 w-6` |
| Hero | 32px+ | `h-8 w-8` |

### Icon Patterns

**Icon Button:**
```tsx
<button className="inline-flex items-center justify-center rounded-md h-11 w-11 hover:bg-accent">
  <Search className="h-5 w-5" aria-hidden />
  <span className="sr-only">Search</span>
</button>
```

**Icon with Label:**
```tsx
<button className="inline-flex items-center gap-2">
  <Search className="h-4 w-4" aria-hidden />
  <span>Search</span>
</button>
```

---

## 15. Data Visualization

### Provenance Display

**Pattern:** Every data surface ends with provenance line.

```tsx
<div className="mt-4 border-t border-border/80 pt-4">
  <p className="text-xs text-muted-foreground">
    Source: {source.name} · Publisher: {source.publisher} · License: {source.license}
  </p>
</div>
```

### Status Badges

```tsx
<span className="inline-block rounded-full border border-border bg-secondary px-2 py-0.5 text-xs font-semibold uppercase tracking-wider">
  {status}
</span>
```

**Status Colors:**
- `editorial-approved`: `bg-primary/10 text-primary border-primary/30`
- `pending-scholarly-review`: `bg-gold-soft/70 text-accent-foreground border-gold/40`

---

## 16. Performance Patterns

### Zero CLS (Cumulative Layout Shift)

**Font Loading:**
```tsx
import { Geist, Lora, Amiri_Quran } from 'next/font/google';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });
```

**Image Loading:**
```tsx
<Image
  src="/image.jpg"
  width={800}
  height={600}
  alt="Description"
  priority /* Above-the-fold images */
/>
```

### Lazy Loading

**Components:**
```tsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./heavy-component'), {
  ssr: false,
  loading: () => <Skeleton />
});
```

**Audio:**
```tsx
<audio preload="none">
  <source src="/audio.mp3" type="audio/mpeg" />
</audio>
```

### Hydration Safety

**Pattern:** Gate client-only content on `hydrated` state.

```tsx
const [hydrated, setHydrated] = useState(false);

useEffect(() => {
  setHydrated(true);
}, []);

if (!hydrated) return <Skeleton />;

return <ClientOnlyContent />;
```

---

## 17. Component Library

### shadcn/ui Components

**Location:** `src/components/ui/`

**Available Components:**
- `button.tsx` — Button variants
- `card.tsx` — Card, CardHeader, CardContent, CardFooter
- `dialog.tsx` — Dialog, DialogContent, DialogHeader, DialogTitle
- `dropdown-menu.tsx` — DropdownMenu, DropdownMenuItem
- `input.tsx` — Text input
- `badge.tsx` — Status badges
- `select.tsx` — Select dropdown
- `tooltip.tsx` — Tooltip

**Pattern:** Radix-based components with Tailwind styling. Accessible by default.

### Custom Components

**Location:** `src/components/`

**Key Custom Components:**
- `quran/ayah-card.tsx` — Quran verse display
- `search/search-box.tsx` — Combobox search with suggestions
- `layout/site-header.tsx` — Desktop navigation
- `layout/mobile-bottom-nav.tsx` — Mobile navigation
- `topics/topic-graph.tsx` — Topic relationship visualization

---

## 18. Design Tokens Summary

### CSS Variables

```css
:root {
  /* Colors */
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --primary: 142 72% 29%;
  --gold: 45 93% 47%;
  
  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-4: 1rem;
  
  /* Radius */
  --radius: 0.5rem;
  
  /* Fonts */
  --font-geist: 'Geist', system-ui, sans-serif;
  --font-amiri: 'Amiri_Quran', serif;
  --font-lora: 'Lora', serif;
}
```

---

## 19. Gaps & Action Items

### Critical Gaps

1. **Dark mode unreachable** — Theme toggle not wired; `className="light"` hardcoded in SSR
2. **Touch target size** — Some buttons/inputs use `h-9` (36px) instead of `h-11` (44px)
3. **RTL physical properties** — Some components use `left-2`, `ml-auto` instead of `start-2`, `ms-auto`

### Medium Gaps

1. **i18n coverage** — Some components have hardcoded English strings
2. **Arabic `lang` attribute** — Some Arabic spans missing `lang="ar"`
3. **Dialog close label** — "Close" text not translated

### Recommendations

1. Wire theme toggle to enable dark mode
2. Increase all button/input heights to `h-11` (44px) minimum
3. Replace physical positioning with logical properties for RTL
4. Complete i18n coverage across all components
5. Add `lang="ar"` to all Arabic text elements

---

## 20. Usage Guidelines

### Do

- ✅ Use semantic HTML (`<button>`, `<a>`, `<nav>`, `<main>`)
- ✅ Add `aria-*` attributes for accessibility
- ✅ Use logical properties for RTL support
- ✅ Add `lang="ar"` and `dir="rtl"` to Arabic text
- ✅ Use `focus-visible:` for keyboard navigation
- ✅ Respect `prefers-reduced-motion`
- ✅ Provide provenance for all data surfaces
- ✅ Use `max-w-*` for reading comfort

### Don't

- ❌ Use color alone to convey information
- ❌ Use physical positioning in RTL context
- ❌ Hardcode English strings (use i18n)
- ❌ Remove focus indicators
- ❌ Use `window.confirm` or `window.alert`
- ❌ Modify Quran Arabic text or ayah ordering
- ❌ Introduce new product features without approval
- ❌ Activate AI religious answers without safety gates

---

## Conclusion

The FAHM design system is built on a strong foundation of accessibility, semantic HTML, and cultural sensitivity. This document captures the existing patterns and tokens that ensure visual consistency across the application.

**Next Steps:**
1. Address critical gaps (dark mode, touch targets, RTL)
2. Complete i18n coverage
3. Document any new components or patterns as they are added
4. Review and update this document quarterly

---

**Document Version:** 1.0  
**Last Updated:** November 12, 2026  
**Maintained By:** FAHM Editorial Team