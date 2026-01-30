# Story 1.5: Create Layout Components (Navbar, Footer, Hero, Container)

Status: done

## Story

As a **visitor**,
I want **the navigation and page structure to match cie4**,
So that **I can navigate the site with the expected design**.

## Acceptance Criteria

1. **AC1:** `Navbar` has transparent → solid scroll behavior with mobile hamburger menu (FR50)
2. **AC2:** `Footer` matches cie4 exactly (FR56)
3. **AC3:** `Hero` component matches cie4 full-screen hero with background overlay (FR54)
4. **AC4:** `StatsBar` component displays statistics with accent border (FR55)
5. **AC5:** `Container` and `Section` layout utilities match cie4 spacing
6. **AC6:** Responsive breakpoints work (768px mobile, 1024px tablet) (FR47)

## Tasks / Subtasks

- [x] Task 1: Create Container and Section layout components (AC: 5)
  - [x] Create `src/components/layout/Container.tsx` with max-width 1200px
  - [x] Create `src/components/layout/Section.tsx` with 100px padding
  - [x] Create `src/components/layout/Container.module.css`
  - [x] Create `src/components/layout/Section.module.css`
  - [x] Add responsive padding adjustments for tablet/mobile
  - [x] Export from `src/components/layout/index.ts`

- [x] Task 2: Create Navbar component (AC: 1, 6)
  - [x] Create `src/components/layout/Navbar.tsx` as Client Component ('use client')
  - [x] Create `src/components/layout/Navbar.module.css` with cie4 exact styles
  - [x] Implement transparent → solid background on scroll (useEffect + scroll listener)
  - [x] Implement logo with color change on scroll (white → --text-heading)
  - [x] Implement nav links with active state styling
  - [x] Implement mobile hamburger toggle button
  - [x] Implement mobile menu slide-in (right: -100% → 0)
  - [x] Add placeholder for theme toggle button (Story 1.6)
  - [x] Add focus-visible styles for accessibility
  - [x] Export from `src/components/layout/index.ts`

- [x] Task 3: Create Footer component (AC: 2)
  - [x] Create `src/components/layout/Footer.tsx`
  - [x] Create `src/components/layout/Footer.module.css` with cie4 styles
  - [x] Implement dark background (#121212) with muted text
  - [x] Add copyright text with current year
  - [x] Export from `src/components/layout/index.ts`

- [x] Task 4: Create Hero component (AC: 3)
  - [x] Create `src/components/layout/Hero.tsx`
  - [x] Create `src/components/layout/Hero.module.css` with cie4 styles
  - [x] Implement full-screen (100vh) variant with background image
  - [x] Implement page-header (50vh) variant for subpages
  - [x] Add brightness overlay filter (0.65)
  - [x] Style hero title/subtitle with text-shadow
  - [x] Add children slot for CTA buttons
  - [x] Export from `src/components/layout/index.ts`

- [x] Task 5: Create StatsBar component (AC: 4)
  - [x] Create `src/components/layout/StatsBar.tsx`
  - [x] Create `src/components/layout/StatsBar.module.css` with cie4 styles
  - [x] Implement negative margin overlap (-60px)
  - [x] Implement 3-column grid with stats
  - [x] Add accent border-bottom (4px)
  - [x] Add responsive single-column for mobile
  - [x] Export from `src/components/layout/index.ts`

- [x] Task 6: Update layout and verify integration (AC: 1-6)
  - [x] Update `src/app/layout.tsx` to include Navbar and Footer
  - [x] Update test page to demonstrate all layout components
  - [x] Verify scroll behavior works correctly
  - [x] Verify mobile menu opens/closes
  - [x] Run `npm run build` to verify no errors

## Dev Notes

### CRITICAL: Source Files

All component styles MUST be extracted from `cie4/style.css` - this is the approved design. Do NOT deviate from these values.

### Container Styles (EXACT VALUES FROM cie4/style.css)

```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) {
  .container { padding: 0 40px; }
}
```

### Section Styles

```css
.section {
  padding: 100px 0;
}
```

### Navbar Styles (EXACT VALUES FROM cie4/style.css:243-300)

```css
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  padding: 20px 0;
  transition: all 0.4s ease;
  background: transparent;
}

.navbar.scrolled {
  background: var(--bg-card);
  box-shadow: 0 2px 20px var(--shadow-card);
  padding: 15px 0;
}

.nav-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Logo */
.logo {
  font-family: var(--font-heading);
  font-size: 1.8rem;
  font-weight: 700;
  color: white;
}
.navbar.scrolled .logo {
  color: var(--text-heading);
}

/* Links */
.nav-links {
  display: flex;
  gap: 32px;
  align-items: center;
}

.nav-links a:not(.btn) {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  font-size: var(--text-base);
}

.nav-links a.active:not(.btn) {
  color: white !important;
  font-weight: 700;
  border-bottom: 2px solid var(--color-accent);
}

/* Scrolled state links */
.navbar.scrolled .nav-links a:not(.btn) {
  color: var(--text-main);
}
.navbar.scrolled .nav-links a:not(.btn):hover {
  color: var(--color-accent);
}
.navbar.scrolled .nav-links a.active:not(.btn) {
  color: var(--color-primary) !important;
  border-bottom-color: var(--color-primary);
}

/* Mobile Menu */
.menu-toggle {
  display: none;
  color: white;
  font-size: 2rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
}
.navbar.scrolled .menu-toggle {
  color: var(--text-heading);
}

@media (max-width: 768px) {
  .menu-toggle { display: block; z-index: 1001; }

  .nav-links {
    position: fixed;
    top: 0;
    right: -100%;
    width: 100%;
    height: 100vh;
    background: var(--bg-card);
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
    transition: right 0.3s ease;
    z-index: 1000;
  }
  .nav-links.active { right: 0; }

  .nav-links a:not(.btn) {
    color: var(--text-main);
    font-size: var(--text-xl);
    margin: 10px 0;
  }
}
```

### Footer Styles (EXACT VALUES FROM cie4/style.css:491-499)

```css
.site-footer {
  background: #121212;
  color: var(--text-muted);
  padding: 30px 0;
  text-align: center;
  font-size: var(--text-sm);
  border-top: 1px solid var(--border-main);
}
```

### Hero Styles (EXACT VALUES FROM cie4/style.css:302-329)

```css
/* Full-screen Hero */
.hero {
  height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  filter: brightness(0.65);
  transform: scale(1.05);
  z-index: -1;
}

.hero h1 {
  color: white;
  margin-bottom: 24px;
  text-shadow: 0 2px 10px rgba(0,0,0,0.5);
}

.hero p {
  font-size: var(--text-xl);
  margin-bottom: 40px;
  opacity: 0.95;
  font-weight: 300;
}

/* Page Header (subpages) */
.page-header {
  height: 50vh;
  min-height: 350px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  background-size: cover;
  background-position: center;
  margin-bottom: 60px;
}

.page-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
}

.page-header h1, .page-header p {
  position: relative;
  z-index: 1;
}
```

### StatsBar Styles (EXACT VALUES FROM cie4/style.css:333-349)

```css
.stats-bar {
  background: var(--bg-card);
  padding: 40px 0;
  position: relative;
  z-index: 10;
  margin-top: -60px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  max-width: 1100px;
  margin-left: auto;
  margin-right: auto;
  border-bottom: 4px solid var(--color-accent);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  text-align: center;
}

.stat-item h3 {
  font-size: var(--heading-md);
  margin-bottom: 5px;
  color: var(--color-primary);
}

.stat-item p {
  font-size: var(--text-sm);
  color: var(--color-detail);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
}

@media (max-width: 768px) {
  .stats-bar {
    margin: -30px 10px 40px 10px;
    padding: 30px 20px;
  }
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }
}
```

### TypeScript Component Patterns

**Navbar Component Interface:**
```typescript
interface NavLink {
  href: string;
  label: string;
}

interface NavbarProps {
  links: NavLink[];
  currentPath?: string;
}
```

**Hero Component Interface:**
```typescript
interface HeroProps {
  variant?: 'full' | 'page';
  backgroundImage: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}
```

**StatsBar Component Interface:**
```typescript
interface StatItem {
  value: string;
  label: string;
}

interface StatsBarProps {
  stats: StatItem[];
}
```

### File Structure After This Story

```
src/
├── components/
│   ├── ui/                    # From Story 1.4
│   └── layout/
│       ├── index.ts           # NEW: Barrel export
│       ├── Container.tsx      # NEW
│       ├── Container.module.css
│       ├── Section.tsx        # NEW
│       ├── Section.module.css
│       ├── Navbar.tsx         # NEW (Client Component)
│       ├── Navbar.module.css
│       ├── Footer.tsx         # NEW
│       ├── Footer.module.css
│       ├── Hero.tsx           # NEW
│       ├── Hero.module.css
│       ├── StatsBar.tsx       # NEW
│       └── StatsBar.module.css
├── app/
│   ├── layout.tsx             # MODIFIED: Add Navbar/Footer
│   └── page.tsx               # MODIFIED: Demo layout components
```

### What NOT to Do

- ❌ Do NOT use inline styles (CSS Modules only)
- ❌ Do NOT hardcode color values (use CSS variables)
- ❌ Do NOT deviate from cie4/style.css values
- ❌ Do NOT forget 'use client' for Navbar (has scroll listener)
- ❌ Do NOT implement theme toggle functionality (that's Story 1.6)
- ❌ Do NOT create scroll animations yet (that's Story 1.7)

### Testing Verification

To verify the implementation:

1. View page and scroll down to see Navbar transition
2. Resize browser to test mobile breakpoint (768px)
3. Click hamburger menu on mobile to test slide-in
4. Test keyboard navigation (Tab) on Navbar links
5. Manually add `class="dark-mode"` to body to test dark mode
6. Run `npm run build` to verify no TypeScript/CSS errors

### References

- [Source: cie4/style.css:243-300] - Navbar styles
- [Source: cie4/style.css:302-329] - Hero styles
- [Source: cie4/style.css:333-349] - StatsBar styles
- [Source: cie4/style.css:491-499] - Footer styles
- [Source: docs/component-inventory.md] - Component specifications
- [Source: docs/planning-artifacts/project-context.md] - CSS & Styling rules

---

## Previous Story Intelligence (Story 1.4)

### Key Learnings from Story 1.4

1. **'use client' required for interactive components**: Button needed 'use client' for onClick - Navbar will need it for scroll listener
2. **Native attributes preferred**: Don't use aria-disabled with disabled attribute
3. **Compound components work well**: Card.Image/Card.Content pattern is clean
4. **Focus-visible for all interactive states**: Add specific focus styles for each variant
5. **Remove inappropriate ARIA roles**: role="status" was wrong for Badge

### Patterns Established

- Components use CSS Modules exclusively
- 'use client' for any component with useState, useEffect, event handlers
- Barrel exports in index.ts
- Focus-visible styles for accessibility
- French UI text (html lang="fr")
- next/image for optimized images

---

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- Build verified: `npm run build` passes with no errors
- Lint verified: `npm run lint` passes (only legacy cie1/cie2 warnings)

### Completion Notes List

1. **AC1 (Navbar):** Implemented transparent → solid scroll behavior with mobile hamburger menu. Uses useState for scroll state and menu toggle, useEffect for scroll listener with passive option for performance.

2. **AC2 (Footer):** Matches cie4 exactly with dark background (#121212), muted text, copyright with current year, and border-top.

3. **AC3 (Hero):** Full-screen (100vh) variant with background overlay (brightness 0.65) and page-header (50vh) variant. Uses inline style only for dynamic backgroundImage, all other styles via CSS Modules.

4. **AC4 (StatsBar):** Displays statistics with accent border-bottom (4px), negative margin overlap (-60px), and 3-column grid. Responsive single-column on mobile.

5. **AC5 (Container/Section):** Container with max-width 1200px and responsive padding. Section with 100px padding and optional bgLight variant.

6. **AC6 (Responsive):** All breakpoints work at 768px (mobile) and 1024px (tablet). Mobile menu slides in from right.

### Change Log

| Date | Change | Reason |
|------|--------|--------|
| 2026-01-26 | Created all 6 layout components | Story implementation |
| 2026-01-26 | Updated layout.tsx with Navbar/Footer | Integration |
| 2026-01-26 | Updated page.tsx with demo content | Verification |
| 2026-01-26 | Code review: Fixed H1, M1-M4 issues | Code review fixes |

### File List

**Created:**
- src/components/layout/Container.tsx
- src/components/layout/Container.module.css
- src/components/layout/Section.tsx
- src/components/layout/Section.module.css
- src/components/layout/Navbar.tsx
- src/components/layout/Navbar.module.css
- src/components/layout/Footer.tsx
- src/components/layout/Footer.module.css
- src/components/layout/Hero.tsx
- src/components/layout/Hero.module.css
- src/components/layout/StatsBar.tsx
- src/components/layout/StatsBar.module.css
- src/components/layout/index.ts

**Modified:**
- src/app/layout.tsx - Added Navbar and Footer
- src/app/page.tsx - Demo with Hero, StatsBar, Section, Container
- src/app/page.module.css - Added sectionHeader styles

---

## Senior Developer Review (AI)

**Reviewer:** Claude Opus 4.5
**Date:** 2026-01-26
**Outcome:** Approved with fixes

### Issues Found: 8 (1 HIGH, 4 MEDIUM, 3 LOW)

### Fixes Applied:

| Issue | Severity | Description | Fix |
|-------|----------|-------------|-----|
| H1 | HIGH | Mobile menu missing body scroll lock | Added useEffect to toggle body overflow |
| M1 | MEDIUM | StatsBar uses array index as React key | Changed to use stat.label as key |
| M2 | MEDIUM | Mobile menu missing Escape key handler | Added keydown event listener |
| M3 | MEDIUM | Mobile menu missing focus trap | Added Tab key focus trap logic |
| M4 | MEDIUM | Navbar hover state not in cie4 spec | Removed transparent mode hover |

### LOW Issues (Not Fixed - Optional):
- L1: Missing aria-current="page" → Fixed as bonus
- L2: Theme toggle uses emoji → Deferred to Story 1.6
- L3: Hero uses div instead of semantic element → Minor, acceptable
