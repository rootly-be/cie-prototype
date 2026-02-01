# Story 5.5: Create Reusable FilterBar Component

Status: done

## Story

As a **developer**,
I want **a reusable filter component**,
So that **all list pages have consistent filtering**.

## Acceptance Criteria

1. **AC1:** Component accepts filter configuration
   - **Given** filter requirements for a page
   - **When** FilterBar is configured
   - **Then** displays appropriate filter controls

2. **AC2:** Supports multiple filter types
   - **When** configured with different filter types
   - **Then** supports select dropdowns
   - **And** supports tag chip buttons

3. **AC3:** Updates URL params for shareability
   - **When** filter is selected
   - **Then** URL query params update
   - **And** page can be shared with filters applied

4. **AC4:** Is a Client Component
   - **When** component renders
   - **Then** uses `'use client'` directive
   - **And** handles client-side state

## Tasks / Subtasks

- [x] Task 1: Create FilterBar component (AC: 1, 4)
  - [x] Create `src/components/ui/FilterBar.tsx` with 'use client'
  - [x] Create `src/components/ui/FilterBar.module.css`
  - [x] Accept filter configuration prop

- [x] Task 2: Implement filter types (AC: 2)
  - [x] Create FilterSelect for dropdown filters
  - [x] Create FilterChips for tag-based filters
  - [x] Support "all" option for reset (allLabel prop)

- [x] Task 3: URL parameter integration (AC: 3)
  - [x] Use useSearchParams and useRouter
  - [x] Update URL on filter change (scroll: false)
  - [x] Read initial state from URL

- [x] Task 4: Export and test (AC: 1-4)
  - [x] Add to UI components index with types
  - [x] Run `npm run build` successfully

## Dev Notes

### CRITICAL: Architecture Requirements

**From docs/planning-artifacts/prd.md:**

```
FR21: Filter by school level
FR22: Filter by category
FR23: Filter by category (formations)
FR24: Filter by age group
FR25: Filter by period/season
FR27: Filter by tags
```

### Filter Configuration Interface

```typescript
interface FilterConfig {
  id: string           // URL param name
  label: string        // Display label
  type: 'select' | 'chips'
  options: { value: string; label: string }[]
  allLabel?: string    // "Tous" by default
}

interface FilterBarProps {
  filters: FilterConfig[]
  basePath: string     // For URL updates
}
```

### URL Parameter Pattern

```
/animations?niveau=P1-P2&category=nature
/stages?periode=ete&age=6-9
```

### References

- [Source: docs/planning-artifacts/prd.md#FR21-27] - Filter requirements
- [Source: Next.js useSearchParams] - URL handling

---

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

**Session:** 2026-02-01
**Build Status:** ✓ Successful compilation

### Completion Notes List

**Implementation completed on 2026-02-01**

**Files Created:**

1. `src/components/ui/FilterBar.tsx` - Client component with URL integration
2. `src/components/ui/FilterBar.module.css` - Filter styles

**Files Modified:**

1. `src/components/ui/index.ts` - Added FilterBar and type exports

**Key Features Implemented:**

- Client component with 'use client' directive
- FilterSelect for dropdown filters
- FilterChips for chip-based filters
- URL parameter integration (useSearchParams, useRouter, usePathname)
- Memoized callbacks with useCallback
- ARIA accessibility (role="group", role="radiogroup", aria-labelledby)
- Custom select arrow styling
- Dark mode support for active chips

---

## Senior Developer Review (AI)

**Review Date:** 2026-02-01
**Outcome:** Approved

### Issues Found and Fixed

**No issues found**

### Notes

- Clean implementation with proper Next.js client-side hooks
- ARIA attributes ensure accessibility for screen readers
- URL updates don't cause scroll (scroll: false)
- Types exported for consumer use

---

## Change Log

| Date | Change | Reason |
|------|--------|--------|
| 2026-02-01 | Story created | Foundational component for Epic 5 |
| 2026-02-01 | Implementation complete | All tasks completed, build successful |
