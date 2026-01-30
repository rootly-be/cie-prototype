# Story 1.6: Implement Dark Mode Toggle

Status: done

## Story

As a **visitor**,
I want **to toggle between light and dark mode**,
So that **I can use my preferred theme**.

## Acceptance Criteria

1. **AC1:** Theme switches between light and dark when user clicks toggle (FR39)
2. **AC2:** Preference is saved to localStorage and persists across sessions (FR40)
3. **AC3:** Colors match cie4 dark mode mappings exactly (FR48)
4. **AC4:** ThemeProvider is a Client Component with proper hydration handling
5. **AC5:** System preference (prefers-color-scheme) is respected as default
6. **AC6:** No flash of wrong theme on page load (FOUC prevention)

## Tasks / Subtasks

- [x] Task 1: Create ThemeContext and ThemeProvider (AC: 1, 4, 5, 6)
  - [x] Create `src/contexts/ThemeContext.tsx` with 'use client'
  - [x] Implement useState for theme ('light' | 'dark' | 'system')
  - [x] Implement useEffect to read localStorage on mount
  - [x] Implement useEffect to detect system preference (prefers-color-scheme)
  - [x] Implement useEffect to apply 'dark-mode' class to body
  - [x] Handle hydration mismatch (use suppressHydrationWarning on html)
  - [x] Export ThemeContext and useTheme hook

- [x] Task 2: Create ThemeToggle component (AC: 1, 3)
  - [x] Create `src/components/ui/ThemeToggle.tsx` with 'use client'
  - [x] Create `src/components/ui/ThemeToggle.module.css`
  - [x] Use SVG icons for sun/moon (not emoji)
  - [x] Style to match cie4 theme-toggle-btn exactly
  - [x] Add accessible aria-label
  - [x] Export from `src/components/ui/index.ts`

- [x] Task 3: Implement localStorage persistence (AC: 2)
  - [x] Save theme preference to localStorage key 'theme'
  - [x] Read preference on mount (client-side only)
  - [x] Handle localStorage not available (SSR, private browsing)

- [x] Task 4: Integrate into layout and Navbar (AC: 1-6)
  - [x] Wrap app with ThemeProvider in `src/app/layout.tsx`
  - [x] Add script to html head for FOUC prevention
  - [x] Replace Navbar placeholder with ThemeToggle component
  - [x] Remove disabled attribute and emoji from Navbar
  - [x] Verify theme toggle works in both transparent and scrolled navbar states

- [x] Task 5: Verify dark mode styles (AC: 3)
  - [x] Test all components render correctly in dark mode
  - [x] Verify color mappings match cie4 body.dark-mode exactly
  - [x] Test Hero, StatsBar, Cards, Buttons, Badges in dark mode
  - [x] Run `npm run build` to verify no errors

## Dev Notes

### CRITICAL: Source Files

Dark mode CSS variables are already defined in `src/app/globals.css` (from Story 1.3). The implementation must add the `dark-mode` class to `<body>` element.

### cie4 Dark Mode Mapping (FROM cie4/style.css:82-103)

```css
body.dark-mode {
    --color-primary: var(--D-sapin-text);  /* Titres clairs */
    --color-btn-bg: var(--D-sapin-btn);    /* Boutons solides */
    --color-accent: var(--D-feuille);
    --color-detail: var(--D-ecorce);       /* Beige lisible */
    --color-icon: var(--D-eau);

    --bg-body: var(--D-bg);
    --bg-card: var(--D-surface);
    --bg-input: #2c2c2c;

    --text-main: var(--D-text);
    --text-muted: #a0aab4;
    --text-heading: var(--D-sapin-text);
    --text-inverse: #ffffff;

    --focus-ring: 0 0 0 3px rgba(129, 212, 250, 0.5);
    --border-main: var(--D-border);
    --shadow-card: 0 4px 20px rgba(0,0,0,0.5);
}
```

### Theme Toggle Button Styles (FROM cie4/style.css:286-295)

```css
.theme-toggle-btn {
    background: none;
    border: 1px solid rgba(255,255,255,0.3);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    transition: 0.3s;
}
.theme-toggle-btn:hover { background: rgba(255,255,255,0.1); }
.navbar.scrolled .theme-toggle-btn {
    color: var(--text-main);
    border-color: var(--border-main);
}
.navbar.scrolled .theme-toggle-btn:hover {
    background: rgba(0,0,0,0.05);
}
```

### TypeScript Interfaces

```typescript
type Theme = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}
```

### FOUC Prevention Script

Add this inline script to `<head>` BEFORE any other scripts:

```typescript
// In layout.tsx, add to <html> or use Script component
const themeScript = `
  (function() {
    try {
      const stored = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (stored === 'dark' || (!stored && prefersDark)) {
        document.body.classList.add('dark-mode');
      }
    } catch (e) {}
  })();
`;
```

### Implementation Pattern for ThemeProvider

```typescript
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Read from localStorage
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored) {
      setTheme(stored);
    }
  }, []);

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('theme', theme);

    // Resolve actual theme
    let resolved: 'light' | 'dark' = 'light';
    if (theme === 'dark') {
      resolved = 'dark';
    } else if (theme === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    setResolvedTheme(resolved);

    // Apply to body
    if (resolved === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [theme]);

  // Listen for system preference changes
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      setResolvedTheme(e.matches ? 'dark' : 'light');
      if (e.matches) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

### SVG Icons for Theme Toggle

**Sun Icon (Light Mode):**
```jsx
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
  <circle cx="12" cy="12" r="5"/>
  <line x1="12" y1="1" x2="12" y2="3"/>
  <line x1="12" y1="21" x2="12" y2="23"/>
  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
  <line x1="1" y1="12" x2="3" y2="12"/>
  <line x1="21" y1="12" x2="23" y2="12"/>
  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
</svg>
```

**Moon Icon (Dark Mode):**
```jsx
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
</svg>
```

### File Structure After This Story

```
src/
├── contexts/
│   └── ThemeContext.tsx       # NEW: ThemeProvider + useTheme
├── components/
│   ├── ui/
│   │   ├── index.ts           # MODIFIED: Export ThemeToggle
│   │   ├── ThemeToggle.tsx    # NEW: Toggle button
│   │   └── ThemeToggle.module.css  # NEW
│   └── layout/
│       └── Navbar.tsx         # MODIFIED: Use ThemeToggle
├── app/
│   └── layout.tsx             # MODIFIED: Wrap with ThemeProvider, add script
```

### What NOT to Do

- ❌ Do NOT use inline styles for theme colors
- ❌ Do NOT forget 'use client' for ThemeProvider and ThemeToggle
- ❌ Do NOT use emoji for icons (use SVG)
- ❌ Do NOT skip FOUC prevention (causes flash on load)
- ❌ Do NOT hardcode dark mode colors (use CSS variables)
- ❌ Do NOT forget to handle SSR/hydration (localStorage is client-only)

### Testing Verification

To verify the implementation:

1. Click theme toggle - should switch between light/dark
2. Refresh page - theme should persist (localStorage)
3. Open DevTools > Application > Local Storage - check 'theme' key exists
4. Test in private/incognito - should default to system preference
5. Change OS dark mode setting - if set to 'system', should follow
6. Hard refresh (Ctrl+Shift+R) - no flash of wrong theme
7. Test all components in dark mode visually match cie4
8. Run `npm run build` to verify no TypeScript errors

### References

- [Source: cie4/style.css:82-103] - Dark mode variable mappings
- [Source: cie4/style.css:286-295] - Theme toggle button styles
- [Source: docs/planning-artifacts/project-context.md] - Client Component rules
- [Source: docs/planning-artifacts/epics.md:341-355] - Story requirements
- [Source: src/components/layout/Navbar.tsx:140-147] - Existing placeholder

---

## Previous Story Intelligence (Story 1.5)

### Key Learnings from Story 1.5

1. **Body manipulation via useEffect**: Used `document.body.style.overflow` pattern - same approach for `document.body.classList`
2. **useRef for DOM elements**: Established pattern for refs
3. **Accessibility patterns**: aria-label, aria-expanded, aria-controls, aria-current
4. **Focus management**: Return focus to trigger element after close
5. **Event listener cleanup**: Always return cleanup function from useEffect

### Patterns Established

- Components use CSS Modules exclusively
- 'use client' for any component with useState, useEffect, event handlers
- Barrel exports in index.ts
- Focus-visible styles for accessibility
- French UI text (html lang="fr")
- Client-side only code guarded in useEffect

### Code Review Fixes from Story 1.5

- H1: Body scroll lock with useEffect cleanup
- M2: Escape key handler pattern
- M3: Focus trap in modals/menus

---

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- Build verified: `npm run build` passes with no errors
- Lint verified: No new warnings introduced

### Completion Notes List

1. **AC1 (Theme toggle):** ThemeToggle component toggles between light/dark by calling setTheme. Uses resolvedTheme to determine current state.

2. **AC2 (localStorage):** Theme preference saved to localStorage key 'theme' on every change. Read on mount with try/catch for SSR safety.

3. **AC3 (cie4 colors):** Dark mode uses existing CSS variables from globals.css. body.dark-mode class applied via document.body.classList.

4. **AC4 (ThemeProvider):** Created as Client Component with 'use client'. Uses createContext/useContext pattern. suppressHydrationWarning on html element.

5. **AC5 (System preference):** Detects prefers-color-scheme via matchMedia. Listens for changes when theme='system'. Default behavior follows system preference.

6. **AC6 (FOUC prevention):** Inline script in html head runs before React hydration. Checks localStorage and prefers-color-scheme, applies dark-mode class immediately.

### Code Review Fixes

| ID | Severity | Issue | Fix Applied |
|----|----------|-------|-------------|
| H1 | HIGH | Context value recreated on every render | Added useMemo for context value |
| M1 | MEDIUM | FOUC script targets body before it exists | Changed to documentElement (html) |
| M2 | MEDIUM | Missing useMemo import | Added to imports |
| L1 | LOW | SVG icons missing width/height attributes | Added width="20" height="20" |
| L2 | LOW | Body background color not set | Added body styles in globals.css |

### Change Log

| Date | Change | Reason |
|------|--------|--------|
| 2026-01-26 | Created ThemeContext with ThemeProvider and useTheme | Task 1 |
| 2026-01-26 | Created ThemeToggle with SVG icons | Task 2 |
| 2026-01-26 | Integrated ThemeProvider and FOUC script in layout.tsx | Task 4 |
| 2026-01-26 | Updated Navbar to use ThemeToggle | Task 4 |
| 2026-01-26 | Code review fixes: useMemo, documentElement, SVG attrs, body styles | Code Review |

### File List

**Created:**
- src/contexts/ThemeContext.tsx
- src/components/ui/ThemeToggle.tsx
- src/components/ui/ThemeToggle.module.css

**Modified:**
- src/app/layout.tsx - Added ThemeProvider wrapper and FOUC prevention script
- src/app/globals.css - Added body background/color with transition (Code Review L2)
- src/styles/variables.css - Changed body.dark-mode to html.dark-mode (Code Review M1)
- src/components/layout/Navbar.tsx - Replaced placeholder with ThemeToggle component
- src/components/layout/Navbar.module.css - Removed disabled styles from themeToggle
- src/components/ui/index.ts - Added ThemeToggle export
