# Story 1.3: Port cie4 CSS Variables and Typography

Status: done

## Story

As a **visitor**,
I want **the site to use the exact cie4 color palette and typography**,
So that **the design matches the approved mockup**.

## Acceptance Criteria

1. **AC1:** All color variables are available (L-sapin, L-feuille, L-ecorce, L-eau) in `src/styles/variables.css`
2. **AC2:** Fonts (Playfair Display, Lora) are loaded from Google Fonts via Next.js Font optimization
3. **AC3:** Typography classes match cie4 exactly in `src/styles/typography.css`
4. **AC4:** Dark mode variables are defined and functional (FR48)
5. **AC5:** CSS variables are importable and usable in `globals.css`

## Tasks / Subtasks

- [x] Task 1: Create variables.css with cie4 color system (AC: 1, 4)
  - [x] Port all light mode palette variables (L-sapin, L-feuille, L-ecorce, L-ecorce-dark, L-eau, L-bg, L-surface, L-text, L-border)
  - [x] Port all dark mode palette variables (D-sapin-text, D-sapin-btn, D-feuille, D-ecorce, D-eau, D-bg, D-surface, D-text, D-border)
  - [x] Define active variable mappings (--color-primary, --color-btn-bg, --color-accent, --color-detail, --color-icon, etc.)
  - [x] Define dark mode `.dark-mode` class with remapped variables
  - [x] Add focus ring variables for accessibility

- [x] Task 2: Configure Google Fonts with Next.js (AC: 2)
  - [x] Import Playfair Display (400, 700) from `next/font/google`
  - [x] Import Lora (400, 500, 600, 700) from `next/font/google`
  - [x] Apply font CSS variables via className on body in layout.tsx
  - [x] Verify fonts load without layout shift

- [x] Task 3: Create typography.css with cie4 type scale (AC: 3)
  - [x] Define font family variables (--font-heading, --font-body)
  - [x] Define text size variables (--text-xs through --heading-lg)
  - [x] Add desktop typography override @media (min-width: 1025px)
  - [x] Style h1-h4 with proper font, weight, line-height
  - [x] Add body base styles

- [x] Task 4: Update globals.css to import new styles (AC: 5)
  - [x] Import variables.css
  - [x] Import typography.css
  - [x] Add base reset styles from cie4 (* { box-sizing: border-box })
  - [x] Add body transition for theme changes

- [x] Task 5: Verify styles in browser (AC: 1-5)
  - [x] Create a test page or update homepage to display all colors
  - [x] Verify fonts render correctly
  - [x] Test dark mode toggle (manual class add for now)
  - [x] Run `npm run build` to verify no CSS errors

## Dev Notes

### CRITICAL: Source Files

The exact CSS values MUST be extracted from `cie4/style.css` - this is the approved design. Do NOT deviate from these values.

### Color Palette (EXACT VALUES FROM cie4/style.css)

**Light Mode Palette (Nature Profonde):**
```css
--L-sapin: #1a4a26;      /* Dominant: Titles, Buttons */
--L-feuille: #649a4f;    /* Secondary: Hover, Accents */
--L-ecorce: #8d5524;     /* Details: Rich text, dates */
--L-ecorce-dark: #1e3d2b; /* Dark variant for special date-box */
--L-eau: #4a8db7;        /* Accents: Icons */
--L-bg: #fdfcf8;         /* Off-white warm */
--L-surface: #ffffff;    /* Pure white */
--L-text: #2c3e50;       /* Dark gray readable */
--L-border: #e0e0e0;
```

**Dark Mode Palette (Nature Lumineuse):**
```css
--D-sapin-text: #a5d6a7; /* Mint Green: For TITLES (readability) */
--D-sapin-btn: #2e7d32;  /* Solid Green: For BUTTONS (white contrast) */
--D-feuille: #81c784;    /* Tender Green: Accents */
--D-ecorce: #e6ceb9;     /* Sand Beige: Replaces brown (readability on black) */
--D-eau: #81d4fa;        /* Sky Blue: Luminous icons */
--D-bg: #121212;         /* Deep black */
--D-surface: #1e1e1e;    /* Anthracite gray */
--D-text: #e0e0e0;       /* Off-white */
--D-border: #333333;
```

### Active Variable Mappings (Default: Light)

```css
:root {
    /* Colors */
    --color-primary: var(--L-sapin);       /* Titles, Brand */
    --color-btn-bg: var(--L-sapin);        /* Button backgrounds */
    --color-accent: var(--L-feuille);      /* Hovers, Active borders */
    --color-detail: var(--L-ecorce);       /* Dates, Stats */
    --color-icon: var(--L-eau);            /* Icons */

    /* Backgrounds */
    --bg-body: var(--L-bg);
    --bg-card: var(--L-surface);
    --bg-input: #ffffff;

    /* Text */
    --text-main: var(--L-text);
    --text-muted: #5a6c7d;          /* Secondary text accessible (4.5:1 on white) */
    --text-heading: var(--L-sapin);
    --text-inverse: #ffffff;

    /* Focus ring */
    --focus-ring: 0 0 0 3px rgba(74, 141, 183, 0.5);

    /* Misc */
    --border-main: var(--L-border);
    --shadow-card: 0 4px 20px rgba(26, 74, 38, 0.08);
}
```

### Dark Mode Mapping

```css
body.dark-mode {
    --color-primary: var(--D-sapin-text);  /* Light titles */
    --color-btn-bg: var(--D-sapin-btn);    /* Solid buttons */
    --color-accent: var(--D-feuille);
    --color-detail: var(--D-ecorce);       /* Readable beige */
    --color-icon: var(--D-eau);

    --bg-body: var(--D-bg);
    --bg-card: var(--D-surface);
    --bg-input: #2c2c2c;

    --text-main: var(--D-text);
    --text-muted: #a0aab4;          /* Secondary text accessible in dark mode */
    --text-heading: var(--D-sapin-text);
    --text-inverse: #ffffff;

    /* Focus ring dark mode */
    --focus-ring: 0 0 0 3px rgba(129, 212, 250, 0.5);

    --border-main: var(--D-border);
    --shadow-card: 0 4px 20px rgba(0,0,0,0.5);
}
```

### Typography Scale (Mobile First)

```css
:root {
    /* Fonts */
    --font-heading: 'Playfair Display', serif;
    --font-body: 'Lora', serif;

    /* Text sizes (Mobile) */
    --text-xs: 0.85rem;
    --text-sm: 0.95rem;
    --text-base: 1.05rem;
    --text-lg: 1.25rem;
    --text-xl: 1.5rem;
    --heading-sm: 2rem;
    --heading-md: 2.5rem;
    --heading-lg: 3rem;

    /* Border radius */
    --radius-sm: 8px;
    --radius-md: 16px;
    --radius-lg: 30px;
}

/* Desktop Typography Override */
@media (min-width: 1025px) {
    :root {
        --text-base: 1.1rem;
        --heading-lg: 4.5rem;
        --heading-md: 3rem;
    }
}
```

### Next.js Font Configuration (MANDATORY PATTERN)

Use Next.js built-in font optimization for performance:

```typescript
// src/app/layout.tsx
import { Playfair_Display, Lora } from 'next/font/google'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-heading',
  display: 'swap',
})

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${playfair.variable} ${lora.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

### File Structure After This Story

```
src/
├── app/
│   ├── layout.tsx       # MODIFIED: Add font variables
│   └── globals.css      # MODIFIED: Import new styles
├── styles/
│   ├── variables.css    # NEW: Color & spacing variables
│   └── typography.css   # NEW: Font & text styles
```

### What NOT to Do

- ❌ Do NOT hardcode color values (use variables)
- ❌ Do NOT use CSS-in-JS or Tailwind (use CSS Modules + variables)
- ❌ Do NOT change the exact hex values from cie4
- ❌ Do NOT import fonts via `<link>` tag (use next/font)
- ❌ Do NOT create components yet (that's Story 1.4+)
- ❌ Do NOT implement theme toggle functionality (that's Story 1.6)

### Testing Verification

To verify the implementation:

1. Create or update a page to display color swatches
2. Manually add `class="dark-mode"` to body in DevTools to test dark mode
3. Check fonts in Network tab (should be self-hosted by Next.js)
4. Run Lighthouse to verify no CLS from font loading

### References

- [Source: cie4/style.css] - Complete source of all CSS values
- [Source: docs/component-inventory.md#CSS Variables] - Design system summary
- [Source: docs/planning-artifacts/architecture.md#Styling Solution] - CSS Modules decision
- [Source: docs/planning-artifacts/project-context.md#CSS & Styling Rules] - Styling rules

---

## Previous Story Intelligence (Story 1.2)

### Key Learnings from Story 1.2

1. **Prisma 7.x API changes:** Documentation patterns were outdated - always verify against actual installed version
2. **Import path consistency:** Use `@/` aliases consistently, caught in code review
3. **npm scripts helpful:** Adding utility scripts (db:test) improves DX
4. **Build verification:** Always run `npm run build` to catch issues early

### Patterns Established

- TypeScript strict mode active
- ESLint configured and passing
- Path alias `@/` verified working
- Prisma singleton pattern with adapter
- Code review process catches documentation drift

---

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

1. Replaced default Geist fonts with Playfair Display and Lora from cie4 design
2. Changed html lang from "en" to "fr" for French content
3. Created design system preview page to visualize colors and typography

### Completion Notes List

1. **AC1 ✓**: All color variables ported to `src/styles/variables.css` - 9 light mode + 9 dark mode palette variables
2. **AC2 ✓**: Fonts loaded via next/font with `display: 'swap'` to prevent layout shift
3. **AC3 ✓**: Typography scale with mobile-first approach and desktop override at 1025px
4. **AC4 ✓**: Dark mode fully implemented via `body.dark-mode` class with complete variable remapping
5. **AC5 ✓**: CSS imports working in globals.css, variables usable throughout app

### Change Log

| Date | Change | Reason |
|------|--------|--------|
| 2026-01-26 | Created src/styles/variables.css | AC1, AC4 - Color system with light/dark mode |
| 2026-01-26 | Created src/styles/typography.css | AC3 - Typography scale and heading styles |
| 2026-01-26 | Updated src/app/layout.tsx | AC2 - Google Fonts via next/font |
| 2026-01-26 | Updated src/app/globals.css | AC5 - Import design system files |
| 2026-01-26 | Updated src/app/page.tsx | Test page to display design system |
| 2026-01-26 | Updated src/app/page.module.css | Styles using new CSS variables |
| 2026-01-26 | Code review: Removed inline styles from page.tsx | H1 - Compliance with project-context.md |
| 2026-01-26 | Code review: Added prefers-reduced-motion | M1 - Accessibility improvement |
| 2026-01-26 | Code review: Removed duplicate body transition | M2 - Code cleanup |
| 2026-01-26 | Code review: Translated page content to French | M3 - Language consistency |

### File List

**Created:**
- `src/styles/variables.css` - Color and spacing CSS variables (light + dark mode)
- `src/styles/typography.css` - Font families and text scale

**Modified:**
- `src/app/layout.tsx` - Added Playfair Display and Lora fonts via next/font
- `src/app/globals.css` - Imports variables.css and typography.css
- `src/app/page.tsx` - Design system preview page (translated to French, inline styles removed)
- `src/app/page.module.css` - Updated to use cie4 CSS variables + color swatch classes

---

## Senior Developer Review

### Review Date
2026-01-26

### Reviewer
Claude Opus 4.5 (Adversarial Code Review)

### Issues Found and Fixed

| ID | Severity | Issue | Resolution |
|----|----------|-------|------------|
| H1 | HIGH | Inline styles in page.tsx violate project-context.md rules | Created CSS classes for color swatches in page.module.css |
| M1 | MEDIUM | Missing prefers-reduced-motion for accessibility | Added @media (prefers-reduced-motion) in typography.css |
| M2 | MEDIUM | Duplicate body transition in globals.css and typography.css | Removed duplicate from globals.css |
| M3 | MEDIUM | Page content in English on French site | Translated all UI text to French |
| L1 | LOW | CSS @import instead of TS import (not fixed) | Acceptable for design system separation |
| L2 | LOW | Font variables commented without fallback (not fixed) | next/font handles fallback automatically |

### Verification

- [x] `npm run build` passes
- [x] All acceptance criteria met
- [x] No inline styles (H1 fixed)
- [x] Accessibility improved with reduced motion support (M1 fixed)
- [x] No code duplication (M2 fixed)
- [x] French language consistency (M3 fixed)

### Recommendation

**APPROVED** - Story ready for done status. All HIGH and MEDIUM issues addressed.
