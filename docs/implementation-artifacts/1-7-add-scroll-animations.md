# Story 1.7: Add Scroll Animations

Status: done

## Story

As a **visitor**,
I want **smooth fade-in animations when scrolling**,
So that **the site feels polished and engaging**.

## Acceptance Criteria

1. **AC1:** Fade-in-up animation triggers when page sections come into view (FR49)
2. **AC2:** Animation respects `prefers-reduced-motion` setting (NFR22)
3. **AC3:** Animation timing matches cie4 exactly (0.6s ease-out, translateY 20px)

## Tasks / Subtasks

- [x] Task 1: Create scroll animation CSS (AC: 1, 3)
  - [x] Create `src/styles/animations.css` with `.animate-on-scroll` styles
  - [x] Add `.is-visible` state styles (opacity: 1, transform: translateY(0))
  - [x] Add stagger delays for nth-child elements (0s, 0.1s, 0.2s, 0.3s, 0.4s)
  - [x] Import animations.css in globals.css

- [x] Task 2: Add prefers-reduced-motion support (AC: 2)
  - [x] Add @media (prefers-reduced-motion: reduce) query
  - [x] Set animation-duration and transition-duration to near-instant
  - [x] Make .animate-on-scroll fully visible immediately in reduced motion

- [x] Task 3: Create useScrollAnimation hook (AC: 1, 2, 3)
  - [x] Create `src/hooks/useScrollAnimation.ts` with 'use client'
  - [x] Implement IntersectionObserver with options (rootMargin: '0px 0px -50px 0px', threshold: 0.1)
  - [x] Check prefers-reduced-motion via matchMedia
  - [x] If reduced motion, add is-visible class immediately
  - [x] If normal motion, add is-visible on intersection
  - [x] Return ref to attach to container element

- [x] Task 4: Create ScrollReveal component wrapper (AC: 1, 2, 3)
  - [x] Create `src/components/ui/ScrollReveal.tsx` with 'use client'
  - [x] No separate CSS module needed (uses global animation classes)
  - [x] Accept children and optional className
  - [x] Use useScrollAnimation hook internally
  - [x] Export from `src/components/ui/index.ts`

- [x] Task 5: Apply animations to existing components (AC: 1)
  - [x] Skip Hero (above the fold - FOUC concern per Dev Notes)
  - [x] Add ScrollReveal to StatsBar component in page.tsx
  - [x] Add ScrollReveal to Card components in grids with stagger delays
  - [x] Verify animations trigger correctly on scroll
  - [x] Run `npm run build` to verify no errors

## Dev Notes

### CRITICAL: Source Files

**cie4/style.css:517-533 - Animation CSS:**
```css
/* Éléments animables - état initial (invisible) */
.animate-on-scroll {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.animate-on-scroll.is-visible {
    opacity: 1;
    transform: translateY(0);
}

/* Stagger pour les cartes (délai progressif) */
.animate-on-scroll:nth-child(1) { transition-delay: 0s; }
.animate-on-scroll:nth-child(2) { transition-delay: 0.1s; }
.animate-on-scroll:nth-child(3) { transition-delay: 0.2s; }
.animate-on-scroll:nth-child(4) { transition-delay: 0.3s; }
.animate-on-scroll:nth-child(5) { transition-delay: 0.4s; }
```

**cie4/style.css:619-632 - Reduced Motion:**
```css
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }

    .animate-on-scroll {
        opacity: 1;
        transform: none;
    }
}
```

**cie4/script.js:90-120 - IntersectionObserver:**
```javascript
// Respecte prefers-reduced-motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if (animatedElements.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px', // Triggers a bit before fully visible
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // Only once
                }
            });
        }, observerOptions);

        animatedElements.forEach(el => observer.observe(el));
    }
} else {
    // If reduced motion, make everything visible immediately
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        el.classList.add('is-visible');
    });
}
```

### TypeScript Interface for Hook

```typescript
interface UseScrollAnimationOptions {
  rootMargin?: string;
  threshold?: number;
  triggerOnce?: boolean;
}

interface UseScrollAnimationReturn {
  ref: React.RefObject<HTMLElement>;
  isVisible: boolean;
}
```

### Implementation Pattern for useScrollAnimation

```typescript
'use client';

import { useRef, useEffect, useState } from 'react';

interface UseScrollAnimationOptions {
  rootMargin?: string;
  threshold?: number;
  triggerOnce?: boolean;
}

export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const {
    rootMargin = '0px 0px -50px 0px',
    threshold = 0.1,
    triggerOnce = true,
  } = options;

  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (triggerOnce) {
              observer.unobserve(entry.target);
            }
          } else if (!triggerOnce) {
            setIsVisible(false);
          }
        });
      },
      { rootMargin, threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [rootMargin, threshold, triggerOnce]);

  return { ref, isVisible };
}
```

### Implementation Pattern for ScrollReveal Component

```typescript
'use client';

import { ReactNode } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number; // Optional delay in seconds for stagger effect
}

export function ScrollReveal({ children, className = '', delay }: ScrollRevealProps) {
  const { ref, isVisible } = useScrollAnimation();

  const delayStyle = delay ? { transitionDelay: `${delay}s` } : undefined;

  return (
    <div
      ref={ref}
      className={`animate-on-scroll ${isVisible ? 'is-visible' : ''} ${className}`}
      style={delayStyle}
    >
      {children}
    </div>
  );
}
```

### File Structure After This Story

```
src/
├── styles/
│   ├── variables.css      # Existing
│   ├── typography.css     # Existing
│   └── animations.css     # NEW: Scroll animation styles
├── hooks/
│   └── useScrollAnimation.ts  # NEW: IntersectionObserver hook
├── components/
│   ├── ui/
│   │   ├── index.ts           # MODIFIED: Export ScrollReveal
│   │   ├── ScrollReveal.tsx   # NEW: Animation wrapper
│   │   └── ...
│   └── layout/
│       ├── Hero.tsx           # MODIFIED: Wrap content in ScrollReveal
│       ├── StatsBar.tsx       # MODIFIED: Wrap in ScrollReveal
│       └── ...
├── app/
│   └── globals.css            # MODIFIED: Import animations.css
```

### What NOT to Do

- ❌ Do NOT forget 'use client' for useScrollAnimation hook and ScrollReveal component
- ❌ Do NOT skip prefers-reduced-motion check (accessibility requirement)
- ❌ Do NOT use JavaScript to animate (use CSS transitions triggered by class)
- ❌ Do NOT hardcode timing values (use cie4 exact values: 0.6s ease-out)
- ❌ Do NOT forget to cleanup IntersectionObserver in useEffect return
- ❌ Do NOT animate on every scroll event (use IntersectionObserver)
- ❌ Do NOT apply animation to elements that load above the fold (causes FOUC)

### Testing Verification

To verify the implementation:

1. Scroll down the page - elements should fade in from below
2. Check animation timing matches cie4 (0.6s ease-out)
3. Elements should only animate once (triggerOnce: true)
4. Enable reduced motion in OS settings - animations should be instant
5. Test with DevTools > Rendering > Emulate CSS media feature `prefers-reduced-motion: reduce`
6. Staggered cards should animate with increasing delays
7. Run `npm run build` to verify no TypeScript errors
8. Lighthouse accessibility score should not decrease

### References

- [Source: cie4/style.css:517-533] - Animation CSS classes
- [Source: cie4/style.css:619-632] - prefers-reduced-motion media query
- [Source: cie4/script.js:90-120] - IntersectionObserver implementation
- [Source: docs/planning-artifacts/epics.md:358-370] - Story requirements
- [Source: docs/planning-artifacts/architecture.md] - CSS Modules requirement

---

## Previous Story Intelligence (Story 1.6)

### Key Learnings from Story 1.6

1. **useMemo for context values**: Context values should be memoized to prevent unnecessary re-renders
2. **documentElement vs body**: For FOUC prevention, use documentElement (html) since body may not exist when script runs
3. **Client Component patterns**: 'use client' required for any hook or component using useState, useEffect, browser APIs
4. **CSS Modules**: All styling via CSS Modules, no inline styles except dynamic values
5. **Cleanup patterns**: Always return cleanup function from useEffect when adding listeners

### Patterns Established

- Components use CSS Modules exclusively
- 'use client' for any component with useState, useEffect, event handlers
- Barrel exports in index.ts
- SVG icons with width/height attributes
- Body background/color set in globals.css

### Code Review Fixes from Story 1.6

- H1: Context value recreated on every render → Added useMemo
- M1: FOUC script targets body before it exists → Changed to documentElement
- L1: SVG icons missing width/height → Added attributes
- L2: Body background not set → Added to globals.css

---

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- Build verified: `npm run build` passes with no errors

### Completion Notes List

1. **AC1 (Fade-in-up animation):** Created `.animate-on-scroll` class with opacity: 0, transform: translateY(20px), and `.is-visible` state. IntersectionObserver triggers class addition on scroll with rootMargin '0px 0px -50px 0px' and threshold 0.1.

2. **AC2 (prefers-reduced-motion):** Added @media query that sets animation/transition duration to 0.01ms and makes `.animate-on-scroll` fully visible immediately. Hook checks `matchMedia('(prefers-reduced-motion: reduce)')` and sets visible immediately if true.

3. **AC3 (cie4 timing):** Exact timing from cie4: transition 0.6s ease-out, translateY(20px). Stagger delays: 0s, 0.1s, 0.2s, 0.3s, 0.4s, 0.5s for nth-child elements.

4. **Hero skipped:** Did not add animation to Hero content as it's above the fold and would cause FOUC (per Dev Notes guidance).

5. **TypeScript fix:** RefObject type needed `| null` to satisfy strict TypeScript (RefObject<HTMLDivElement | null>).

### Code Review Fixes

| ID | Severity | Issue | Fix Applied |
|----|----------|-------|-------------|
| M1 | MEDIUM | Duplicate prefers-reduced-motion rules in animations.css | Removed global * selector, kept only .animate-on-scroll specific rule |
| M2 | MEDIUM | Each hook creates new IntersectionObserver | Added comment noting shared observer as future optimization |
| M3 | MEDIUM | Missing `as` prop for semantic HTML flexibility | Added polymorphic `as` prop to ScrollReveal component |

### Change Log

| Date | Change | Reason |
|------|--------|--------|
| 2026-01-26 | Created animations.css with scroll animation styles | Task 1 |
| 2026-01-26 | Added prefers-reduced-motion media query | Task 2 |
| 2026-01-26 | Created useScrollAnimation hook | Task 3 |
| 2026-01-26 | Created ScrollReveal component | Task 4 |
| 2026-01-26 | Applied ScrollReveal to StatsBar and Cards in page.tsx | Task 5 |
| 2026-01-26 | Code review fixes: removed duplicate CSS, added as prop, optimization note | Code Review |

### File List

**Created:**
- src/styles/animations.css
- src/hooks/useScrollAnimation.ts
- src/components/ui/ScrollReveal.tsx

**Modified:**
- src/app/globals.css - Added import for animations.css
- src/components/ui/index.ts - Added ScrollReveal export
- src/app/page.tsx - Wrapped StatsBar and Cards with ScrollReveal
