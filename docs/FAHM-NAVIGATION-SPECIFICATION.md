# FAHM — Information Architecture & Navigation Specification

> **Status:** PROPOSED — not yet implemented
> **Version:** 1.0
> **Date:** November 11, 2026
> **Reconciliation:** See `docs/FAHM-IA-FINAL-RECONCILIATION.md` for authoritative decisions. Key correction: `/topics/[slug]` is canonical (not `/explore/topics/[slug]`).
> **Scope:** Desktop header, mobile bottom nav, global search, settings, personal study, active states, responsive rules, RTL/LTR, accessibility
> **Stack:** Next.js 15.3.8 App Router · React 19 · Tailwind CSS · lucide-react

This document is the authoritative reference for the redesigned navigation system of the FAHM (Quran Al Huda) application. It replaces the current `SiteHeader` (10 items, hidden below `md`) and `MobileBottomNav` (7 tabs, crowded) with a leaner, more intentional structure.

---

## Table of Contents

1. [Desktop Navigation Specification](#1-desktop-navigation-specification)
2. [Mobile Navigation Specification](#2-mobile-navigation-specification)
3. [Search Specification](#3-search-specification)
4. [Settings Access Specification](#4-settings-access-specification)
5. [Personal Study Access Specification](#5-personal-study-access-specification)
6. [Active States and Indicators](#6-active-states-and-indicators)
7. [Navigation Behavior](#7-navigation-behavior)
8. [RTL/LTR Considerations](#8-rtlltr-considerations)
9. [Responsive Rules](#9-responsive-rules)
10. [Accessibility Requirements](#10-accessibility-requirements)

---

## 1. Desktop Navigation Specification

### 1.1 Header Structure

The desktop header is a sticky, translucent bar fixed to the top of the viewport. It is visible only at the `md` breakpoint and above (`≥768px`); below that, the mobile bottom nav takes over.

| Attribute | Value |
|---|---|
| Position | `sticky top-0 z-40` |
| Height | `h-16` (64px) |
| Max content width | `max-w-5xl` (1024px) |
| Background | `bg-background/85 backdrop-blur` with `supports-[backdrop-filter]:bg-background/70` |
| Border | `border-b border-border/70` |
| Visibility | `hidden md:block` |

**Component skeleton:**

```tsx
<header
  className="sticky top-0 z-40 hidden w-full border-b border-border/70
             bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70
             md:block"
  role="banner"
>
  <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6">
    {/* Logo — left in LTR, right in RTL */}
    {/* Primary nav — center-left */}
    {/* Spacer */}
    {/* Utility nav — right in LTR, left in RTL */}
  </div>
</header>
```

### 1.2 Primary Nav Items (5 items max)

The primary nav is reduced from 10 items to **5 items** (plus the logo). This eliminates redundancy (e.g., separate "Topics", "Plans", "Quiz" entries) and consolidates under parent routes.

| # | Label (EN) | Icon (lucide-react) | Route | Notes |
|---|---|---|---|---|
| 0 | Logo / Home | — (text: `الحُدَى`) | `/` | Brand mark; doubles as home link |
| 1 | Read | `BookOpen` | `/quran` | Quran reader — primary use case |
| 2 | Explore | `Compass` | `/explore` | Topics, themes, curated journeys |
| 3 | Learn | `GraduationCap` | `/learn` | Plans, quizzes, lessons (consolidated) |
| 4 | My Study | `Bookmark` | `/my-study` | Bookmarks, notes, highlights, history |

**Implementation:**

```tsx
const PRIMARY_NAV = [
  { href: "/quran",    labelKey: "nav.read",    icon: BookOpen },
  { href: "/explore",  labelKey: "nav.explore", icon: Compass },
  { href: "/learn",    labelKey: "nav.learn",   icon: GraduationCap },
  { href: "/my-study", labelKey: "nav.myStudy", icon: Bookmark },
] as const;
```

Each item renders as:

```tsx
<Link
  href={href}
  aria-current={isActive ? "page" : undefined}
  className={cn(
    "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium",
    "transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    isActive
      ? "bg-secondary text-secondary-foreground"
      : "text-foreground/75 hover:bg-secondary hover:text-secondary-foreground"
  )}
>
  <Icon className="h-4 w-4" aria-hidden />
  <span>{label}</span>
</Link>
```

### 1.3 Secondary Nav (Dropdowns / Menus)

The redesigned nav **does not use dropdown menus** for primary items. Sub-sections (e.g., `/learn/plans`, `/learn/quiz`) are reached by:

- Landing on the parent route (`/learn`) which shows a tabbed sub-nav.
- In-page section links within each route.

This keeps the top-level nav flat and predictable. If a dropdown is later required (e.g., for user account), it must:

- Open on click (not hover) for touch/keyboard parity.
- Use `role="menu"` with `aria-expanded` on the trigger.
- Trap focus within the menu while open; close on `Escape`.
- Dismiss when focus leaves the menu.

### 1.4 Utility Nav (right side in LTR)

The utility cluster is visually separated from primary nav by a spacer (`flex-1` between nav groups). Items:

| # | Element | Icon | Behavior |
|---|---|---|---|
| 1 | Global search trigger | `Search` | Opens command palette (`Cmd/Ctrl+K`) |
| 2 | Language selector | `Languages` | Dropdown with EN / AR / UR |
| 3 | Settings | `Settings` | Links to `/settings` |

```tsx
<div className="flex items-center gap-1">
  <button
    type="button"
    onClick={openSearch}
    aria-label={t("search.open")}
    className="inline-flex h-9 w-9 items-center justify-center rounded-full
               text-foreground/75 hover:bg-secondary hover:text-secondary-foreground
               focus-visible:outline-2 focus-visible:outline-ring"
  >
    <Search className="h-4 w-4" aria-hidden />
  </button>

  <LanguageSelector />

  <Link
    href="/settings"
    aria-label={t("nav.settings")}
    className="inline-flex h-9 w-9 items-center justify-center rounded-full
               text-foreground/75 hover:bg-secondary hover:text-secondary-foreground
               focus-visible:outline-2 focus-visible:outline-ring"
  >
    <Settings className="h-4 w-4" aria-hidden />
  </Link>
</div>
```

### 1.5 Active States (Desktop)

See [Section 6](#6-active-states-and-indicators) for the full active-state matrix. Summary:

- **Current top-level route:** filled `bg-secondary` pill + `text-secondary-foreground`.
- **Ancestor of current route:** same filled pill (e.g., `/learn/plans` highlights "Learn").
- **Not current:** `text-foreground/75`, hover lifts to `bg-secondary`.

### 1.6 Keyboard Navigation (Desktop)

| Key | Behavior |
|---|---|
| `Tab` / `Shift+Tab` | Move focus across logo → primary nav items → search → language → settings |
| `Enter` / `Space` | Activate focused link or button |
| `Cmd+K` (mac) / `Ctrl+K` (Win) | Open global search modal |
| `Escape` | Close any open menu, modal, or search palette |
| `←` / `→` (or `rtl:→` / `rtl:←`) | Move focus within horizontal menu (when implemented) |
| `Home` / `End` | Jump to first / last focusable item in nav |

Focus ring: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring` (Tailwind `ring` token, typically `hsl(var(--ring))`).

### 1.7 Desktop Breakpoints

| Breakpoint | Behavior |
|---|---|
| `< md` (< 768px) | Header hidden; mobile bottom nav shown |
| `md` (768px–1023px) | Header shown, compact spacing (`px-4`) |
| `lg` (1024px–1279px) | Header shown, standard spacing (`px-6`) |
| `xl` (≥ 1280px) | Header shown, max content width `max-w-5xl` centered |

---

## 2. Mobile Navigation Specification

### 2.1 Bottom Nav Structure (5 tabs)

The mobile bottom nav is reduced from 7 tabs to **5 tabs**, meeting the ergonomic ceiling for thumb-reachable navigation.

| # | Label (EN) | Icon (lucide-react) | Route |
|---|---|---|---|
| 1 | Home | `Home` | `/` |
| 2 | Read | `BookOpen` | `/quran` |
| 3 | Explore | `Compass` | `/explore` |
| 4 | Learn | `GraduationCap` | `/learn` |
| 5 | My Study | `Bookmark` | `/my-study` |

```tsx
const MOBILE_TABS = [
  { href: "/",         labelKey: "common.home",   icon: Home },
  { href: "/quran",    labelKey: "nav.read",      icon: BookOpen },
  { href: "/explore",  labelKey: "nav.explore",   icon: Compass },
  { href: "/learn",    labelKey: "nav.learn",     icon: GraduationCap },
  { href: "/my-study", labelKey: "nav.myStudy",   icon: Bookmark },
] as const;
```

### 2.2 Mobile Header (Minimal)

A slim top bar is shown on mobile (replacing the full desktop header):

| Element | Position | Notes |
|---|---|---|
| Logo (text `الحُدَى`) | Start (LTR) / End (RTL) | Taps to `/` |
| Page title (optional) | Center | Shown on reader/settings pages |
| Search icon | End (LTR) / Start (RTL) | Opens global search |

```tsx
<header className="sticky top-0 z-40 flex h-14 items-center justify-between
                   border-b border-border/70 bg-background/85 backdrop-blur
                   px-4 md:hidden">
  <Link href="/" aria-label={t("layout.home")}>
    <span className="font-display text-lg font-semibold text-primary">
      {t("layout.siteName")}
    </span>
  </Link>
  <button
    type="button"
    onClick={openSearch}
    aria-label={t("search.open")}
    className="inline-flex h-11 w-11 items-center justify-center rounded-full
               text-foreground/75 hover:bg-secondary
               focus-visible:outline-2 focus-visible:outline-ring"
  >
    <Search className="h-5 w-5" aria-hidden />
  </button>
</header>
```

### 2.3 Search Access (Mobile)

- Primary access: **search icon in mobile header** (top-right).
- Secondary access: in-page search bars on `/quran`, `/explore`, `/learn`.
- Global shortcut `Cmd/Ctrl+K` also works on mobile when a hardware keyboard is attached (iPad, etc.).

### 2.4 Settings Access (Mobile)

Settings is **not** a bottom-nav tab in the redesign. It is reached via:

1. **My Study** tab → settings shortcut card at top of `/my-study`.
2. **Mobile header** → overflow menu (three-dot `MoreHorizontal` icon) → Settings.
3. Direct deep link `/settings` from notifications or shared URLs.

This removes Settings from the 5-tab limit while keeping it one tap away from the most personal section.

### 2.5 Personal Study Access (Mobile)

"My Study" is a dedicated bottom-nav tab (tab 5), providing one-tap access to:

- Bookmarks
- Notes
- Highlights
- Reading history
- Last-read resume card

### 2.6 Touch Targets

All interactive elements must meet or exceed **44×44 CSS pixels** (WCAG 2.5.5 AAA target size recommendation; Apple HIG minimum).

| Element | Min size | Implementation |
|---|---|---|
| Bottom nav tab | 44×56 px | `min-h-14 w-full flex-1` inside `flex` container |
| Mobile header icon button | 44×44 px | `h-11 w-11` |
| Desktop nav link | 32×32 px (keyboard-only) | `py-2 px-3.5` with `focus-visible` ring |
| Desktop utility icon button | 36×36 px | `h-9 w-9` |

```tsx
// Bottom nav tab — guaranteed 44px+ vertical hit area
<Link
  className="flex min-h-14 flex-col items-center justify-center gap-0.5
             px-1 py-2 text-[0.6875rem] font-medium"
>
```

### 2.7 Safe Area Handling

The bottom nav must respect device safe areas (iPhone notch, home indicator):

```tsx
<nav
  className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70
             bg-background/95 backdrop-blur md:hidden"
  style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
>
```

The mobile header similarly respects top safe areas on notched devices:

```tsx
<header
  className="sticky top-0 z-40 md:hidden"
  style={{ paddingTop: "env(safe-area-inset-top)" }}
>
```

Viewport meta tag must include `viewport-fit=cover`:

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
```

---

## 3. Search Specification

### 3.1 Global Search Shortcut

| Platform | Shortcut |
|---|---|
| macOS | `⌘ + K` |
| Windows / Linux | `Ctrl + K` |
| Mobile (with hardware keyboard) | `Ctrl + K` |
| Mobile (touch) | Tap search icon in header |

Implementation:

```tsx
useEffect(() => {
  const handler = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      openSearch();
    }
  };
  window.addEventListener("keydown", handler);
  return () => window.removeEventListener("keydown", handler);
}, [openSearch]);
```

### 3.2 Search Box Placement

Search is implemented as a **command palette modal** (not a persistent input in the header), consistent with modern web apps:

- Centered overlay, max-width `max-w-lg` (512px).
- Opens with auto-focused input.
- Backdrop: `bg-background/60 backdrop-blur-sm`.
- Dismiss: `Escape`, click outside, or close button.

```tsx
<Dialog open={searchOpen} onOpenChange={setSearchOpen}>
  <DialogContent className="max-w-lg">
    <input
      ref={inputRef}
      type="search"
      autoFocus
      placeholder={t("search.placeholder")}
      aria-label={t("search.label")}
      className="w-full rounded-lg border border-border bg-background px-4 py-3
                 text-base focus-visible:outline-2 focus-visible:outline-ring"
    />
    {/* Results list */}
  </DialogContent>
</Dialog>
```

### 3.3 Autocomplete Behavior

- **Debounce:** 150ms after keystroke.
- **Minimum query length:** 2 characters.
- **Result categories:**
  1. **Verses** — matched by Arabic, transliteration, or translation text.
  2. **Topics** — matched by topic name or description.
  3. **Lessons / Plans** — matched by title.
  4. **My Study** — user's own bookmarks and notes (private, local-first).
- **Display:** grouped by category with section headers.
- **Keyboard navigation:** `↑` / `↓` to move through results, `Enter` to select, `Escape` to close.
- **Recent searches:** persisted locally (no server), shown when input is empty, max 5 items.

### 3.4 Search Results Page

For full results (beyond the palette's top 5 per category), route to `/search?q=...`:

- URL-synced query parameter (`?q=`).
- Filter tabs: All · Verses · Topics · Lessons · My Study.
- Pagination or infinite scroll (infinite scroll preferred for verse results).
- Shareable URL for deep linking.

---

## 4. Settings Access Specification

### 4.1 Desktop Access

Settings is an **icon button in the utility cluster** of the desktop header (right side, after language selector).

- Icon: `Settings` (lucide-react).
- `aria-label` localized: "Settings".
- Links directly to `/settings`.
- No dropdown — settings is a full page, not a popover.

### 4.2 Mobile Access

Settings is reached through two paths:

1. **My Study tab** → prominent "Settings" card at the top of `/my-study`.
2. **Mobile header overflow menu** → `MoreHorizontal` icon → "Settings" item.

```tsx
// Inside /my-study page
<Card className="mb-4">
  <Link href="/settings" className="flex items-center gap-3 p-4">
    <Settings className="h-5 w-5 text-muted-foreground" />
    <span className="font-medium">{t("settings.title")}</span>
    <ChevronRight className="ms-auto h-4 w-4 text-muted-foreground" />
  </Link>
</Card>
```

### 4.3 Settings Contents

The `/settings` page includes:

| Section | Options |
|---|---|
| **Display** | Theme (light/dark/system), font size, Arabic font choice |
| **Reading** | Default translation, default reciter, show transliteration |
| **Language** | Interface language (EN / AR / UR) — also in header selector |
| **My Data** | Export notes/bookmarks (JSON), import, clear local data |
| **About** | App version, credits, privacy policy, feedback link |

---

## 5. Personal Study Access Specification

### 5.1 Desktop Access

"My Study" is a **primary nav item** in the desktop header (item 4), with the `Bookmark` icon.

- Route: `/my-study`.
- Shows dashboard with: recent reading, bookmarks, notes, highlights, history.

### 5.2 Mobile Access

"My Study" is **bottom nav tab 5** (`Bookmark` icon), providing one-tap access from anywhere in the app.

### 5.3 Quick Access from Quran Reader

While reading the Quran (`/quran/[surah]/[ayah]`), the reader toolbar exposes:

| Button | Icon | Action |
|---|---|---|
| Bookmark | `Bookmark` / `BookmarkPlus` | Toggle bookmark on current ayah |
| Note | `FileText` / `PenLine` | Open note editor for current ayah |
| Highlight | `Highlighter` | Pick color, apply to selected text |
| Share | `Share2` | Share ayah link or image |
| Copy | `Copy` | Copy Arabic + translation to clipboard |

These buttons live in a **sticky reader toolbar** at the bottom of the reader view (above the mobile bottom nav on mobile, or inline on desktop).

```tsx
<div className="sticky bottom-0 z-30 flex items-center justify-around
                border-t border-border bg-background/95 backdrop-blur
                py-2 md:bottom-16">
  <ReaderActionButton icon={Bookmark}    labelKey="reader.bookmark"    onClick={toggleBookmark} />
  <ReaderActionButton icon={PenLine}     labelKey="reader.note"       onClick={openNote} />
  <ReaderActionButton icon={Highlighter} labelKey="reader.highlight"  onClick={openHighlighter} />
  <ReaderActionButton icon={Share2}      labelKey="reader.share"      onClick={share} />
  <ReaderActionButton icon={Copy}        labelKey="reader.copy"       onClick={copy} />
</div>
```

Each button is ≥44×44 px on mobile, with an `aria-label` and a visible pressed state when the ayah is bookmarked/noted.

---

## 6. Active States and Indicators

### 6.1 Active-State Matrix

| Context | Visual treatment |
|---|---|
| **Current top-level route** (e.g., on `/explore`) | Filled pill: `bg-secondary text-secondary-foreground` |
| **Ancestor of current route** (e.g., on `/explore/topics/faith`, "Explore" is active) | Same filled pill |
| **Hover on inactive item** | `bg-secondary` background, `text-secondary-foreground` |
| **Focus (keyboard)** | `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring` |
| **Inactive** | `text-foreground/75` |
| **Mobile tab active** | `text-primary` (brand color) on icon + label; inactive is `text-muted-foreground` |
| **Mobile tab pressed** | Brief `scale-95` transform (100ms) for tactile feedback |

### 6.2 Active-Route Matching Logic

```ts
function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
```

This ensures `/learn/plans` correctly highlights "Learn" in the primary nav.

### 6.3 Section Indicators (Within a Page)

For pages with internal sections (e.g., `/my-study` has Bookmarks / Notes / History tabs):

- Use **segmented control** (pill-style tabs) at the top of the content area.
- Active segment: `bg-primary text-primary-foreground`.
- Inactive segment: `text-muted-foreground`, hover `bg-secondary`.
- URL-synced via query param (`?tab=bookmarks`) or sub-route (`/my-study/bookmarks`).

---

## 7. Navigation Behavior

### 7.1 Client-Side Routing

All navigation uses Next.js App Router client-side transitions via `<Link>` from `next/link`. No full-page reloads for in-app routes.

```tsx
import Link from "next/link";
<Link href="/explore">...</Link>
```

For programmatic navigation (e.g., after form submit):

```tsx
import { useRouter } from "next/navigation";
const router = useRouter();
router.push("/my-study");
```

### 7.2 Scroll Restoration

- **Default Next.js behavior:** scroll to top on route change; restore scroll on back/forward.
- **Exception:** within the Quran reader, scroll position is preserved per surah so the user returns to the same ayah.
- **Hash links** (`#section`): scroll to anchor without resetting page scroll.

### 7.3 Back Button Behavior

- Browser back button works naturally via Next.js router.
- Each route change pushes a history entry (default).
- Modal overlays (search, settings sheet on mobile) do **not** push history — they close on back without leaving the page.
- If a modal should participate in history (e.g., full-screen reader), use `router.push` with a shallow route.

### 7.4 Deep Linking

Every major screen has a stable URL:

| Screen | URL |
|---|---|
| Home | `/` |
| Quran reader (surah) | `/quran/[surah]` (e.g., `/quran/2`) |
| Quran reader (ayah) | `/quran/[surah]/[ayah]` (e.g., `/quran/2/255`) |
| Explore topic | `/explore/topics/[slug]` |
| Learn plan | `/learn/plans/[id]` |
| My Study | `/my-study` |
| Settings | `/settings` |
| Search | `/search?q=...` |

All deep links must:

- Render correctly on first load (SSR / static where possible).
- Preserve language prefix if multi-language URLs are adopted later.
- Work when shared externally (Open Graph meta tags required).

---

## 8. RTL/LTR Considerations

### 8.1 Language → Direction Mapping

| Interface Language | Text Direction |
|---|---|
| English (EN) | LTR |
| Arabic (AR) | RTL |
| Urdu (UR) | RTL |

The `dir` attribute is set on `<html>` based on the active interface language:

```tsx
<html lang={locale} dir={locale === "en" ? "ltr" : "rtl"}>
```

Arabic **content** (Quran text, hadith) is always rendered RTL regardless of interface language, using the `arabic-display` utility class.

### 8.2 Layout Mirroring

All layout uses **logical properties** so Tailwind automatically mirrors in RTL:

| Physical | Logical (Tailwind) |
|---|---|
| `left` / `right` | `start` / `end` |
| `ml-*` / `mr-*` | `ms-*` / `me-*` |
| `pl-*` / `pr-*` | `ps-*` / `pe-*` |
| `text-left` / `text-right` | `text-start` / `text-end` |
| `rounded-l-*` / `rounded-r-*` | `rounded-s-*` / `rounded-e-*` |

**Example:**

```tsx
// LTR: icon on left of label. RTL: icon on right of label. Same code.
<span className="inline-flex items-center gap-1.5">
  <Icon className="h-4 w-4" aria-hidden />
  <span>{label}</span>
</span>
```

### 8.3 Icon Positioning

- Directional icons (arrows, chevrons) must flip in RTL. Use `rtl:rotate-180` or swap to the mirrored lucide icon (`ChevronLeft` ↔ `ChevronRight`).
- Non-directional icons (Bookmark, Settings, Search, Home) do **not** flip.
- The `Search` icon in the header stays on the **end** side in both LTR and RTL (i.e., right in EN, left in AR/UR).

### 8.4 Text Alignment

- UI labels follow the interface direction (`text-start`).
- Arabic Quranic text is always `text-right` with `dir="rtl"` explicitly, even in EN interface.
- Urdu translations follow the interface direction (RTL when UR is selected).

### 8.5 Testing Checklist

- [ ] Desktop header renders correctly in EN, AR, UR.
- [ ] Mobile bottom nav tabs mirror order in RTL.
- [ ] Search palette opens centered in both directions.
- [ ] Reader toolbar icons do not flip incorrectly.
- [ ] Chevron icons flip correctly in breadcrumbs and lists.

---

## 9. Responsive Rules

### 9.1 Breakpoints

| Token | Min-width | Typical devices |
|---|---|---|
| `sm` | 640px | Large phones (landscape) |
| `md` | 768px | Small tablets, large phones landscape |
| `lg` | 1024px | Tablets, small laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large desktops |

### 9.2 Behavior per Breakpoint

| Breakpoint | Navigation component shown | Notes |
|---|---|---|
| `< md` | Mobile bottom nav + slim mobile header | Touch-first layout |
| `md` – `lg` | Desktop header (compact) | `px-4`, slightly smaller max-width |
| `lg` – `xl` | Desktop header (standard) | `px-6`, `max-w-5xl` |
| `≥ xl` | Desktop header (full) | Same as `lg`, more breathing room |

### 9.3 Mobile-First Approach

All components are authored mobile-first:

1. Base styles target mobile.
2. `md:` prefix adds desktop behavior.
3. No `max-md:` hacks unless unavoidable.

```tsx
<nav className="fixed inset-x-0 bottom-0 z-40 md:hidden">
  {/* mobile bottom nav */}
</nav>

<header className="sticky top-0 z-40 hidden md:block">
  {/* desktop header */}
</header>
```

### 9.4 Content Width

- Mobile: full width, `px-4` horizontal padding.
- Tablet (`md`): `max-w-3xl` (768px) centered.
- Desktop (`lg+`): `max-w-5xl` (1024px) centered.

```tsx
<main className="mx-auto w-full max-w-5xl px-4 md:px-6">
```

---

## 10. Accessibility Requirements

### 10.1 ARIA Labels

Every icon-only button must have an `aria-label`:

```tsx
<button aria-label={t("search.open")}>
  <Search className="h-4 w-4" aria-hidden />
</button>
```

Navigation landmarks:

```tsx
<header role="banner">...</header>
<nav aria-label={t("nav.primary")}>...</nav>
<main role="main">...</main>
```

Active page indicator:

```tsx
<Link aria-current={isActive ? "page" : undefined} ...>
```

### 10.2 Keyboard Navigation

- All interactive elements are reachable via `Tab`.
- Focus order follows visual order (logo → primary nav → utility nav).
- Modal dialogs trap focus and restore focus on close.
- `Escape` closes modals, menus, and the search palette.
- Skip link provided (see 10.5).

### 10.3 Focus States

All focusable elements must show a visible focus ring when focused via keyboard (`:focus-visible`, not `:focus`):

```css
focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring
```

The `ring` color token must have ≥ 3:1 contrast against the background.

### 10.4 Screen Reader Announcements

- Route changes: Next.js App Router announces page titles automatically via `<title>` updates.
- Search results loading: use `aria-live="polite"` region:

```tsx
<div aria-live="polite" className="sr-only">
  {isLoading ? t("search.loading") : `${resultCount} ${t("search.resultsFound")}`}
</div>
```

- Bookmark toggle: announce state change:

```tsx
<span aria-live="polite" className="sr-only">
  {isBookmarked ? t("reader.bookmarked") : t("reader.notBookmarked")}
</span>
```

### 10.5 Skip Links

A skip link must be the first focusable element in the document, hidden until focused:

```tsx
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4
             focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2
             focus:text-primary-foreground"
>
  {t("a11y.skipToContent")}
</a>

<main id="main-content" tabIndex={-1}>
  {/* page content */}
</main>
```

### 10.6 Color Contrast

- Body text: ≥ 4.5:1 against background (WCAG AA).
- Large text (≥ 18pt or 14pt bold): ≥ 3:1.
- UI components (focus rings, icons): ≥ 3:1.
- Active-state pills must maintain contrast in both light and dark themes.

### 10.7 Reduced Motion

Users who prefer reduced motion must not see animations:

```tsx
const { resolvedTheme } = useTheme();
// In CSS:
// @media (prefers-reduced-motion: reduce) {
//   * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
// }
```

Tailwind: `motion-reduce:` variant can be applied to transitions.

---

## Appendix A: Icon Reference (lucide-react)

| Purpose | Icon name |
|---|---|
| Home | `Home` |
| Read / Quran | `BookOpen` |
| Explore | `Compass` |
| Learn | `GraduationCap` |
| My Study / Bookmark | `Bookmark` |
| Search | `Search` |
| Settings | `Settings` |
| Language | `Languages` |
| Note | `PenLine` |
| Highlight | `Highlighter` |
| Share | `Share2` |
| Copy | `Copy` |
| More (mobile overflow) | `MoreHorizontal` |
| Chevron (directional) | `ChevronRight` / `ChevronLeft` |

## Appendix B: Route Map

| Route | Nav item | Notes |
|---|---|---|
| `/` | Home (mobile tab 1) | Landing / daily verse |
| `/quran` | Read (desktop #1, mobile tab 2) | Surah list |
| `/quran/[surah]` | — (child of Read) | Surah reader |
| `/quran/[surah]/[ayah]` | — (child of Read) | Ayah deep link |
| `/explore` | Explore (desktop #2, mobile tab 3) | Topic browser |
| `/topics/[slug]` | — (child of Explore conceptually) | Topic detail (canonical; `/explore/topics/[slug]` redirects here) |
| `/learn` | Learn (desktop #3, mobile tab 4) | Learning hub |
| `/learn/plans/[id]` | — (child of Learn) | Plan detail |
| `/learn/quiz` | — (child of Learn) | Quiz |
| `/my-study` | My Study (desktop #4, mobile tab 5) | Personal dashboard |
| `/my-study/bookmarks` | — (child of My Study) | Bookmarks list |
| `/my-study/notes` | — (child of My Study) | Notes list |
| `/settings` | Settings (utility icon) | Preferences |
| `/search` | Search (palette + page) | Full results |

---

**End of specification.** This document is PROPOSED and pending implementation. Any deviations during implementation must be recorded in the Architecture Decision Register (`docs/ARCHITECTURE-DECISION-REGISTER.md`).
