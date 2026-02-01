# Story 5.1: Build Animations List Page with Filters

Status: done

## Story

As a **visitor**,
I want **to browse animations by school level and category**,
So that **I can find programs suitable for my class**.

## Acceptance Criteria

1. **AC1:** List displays published animations
   - **Given** animations exist in database
   - **When** page loads
   - **Then** only published animations display

2. **AC2:** Filter by school level works (FR21)
   - **When** visitor selects a level
   - **Then** list filters to that level
   - **And** URL updates with filter

3. **AC3:** Filter by category works (FR22)
   - **When** visitor selects a category
   - **Then** list filters to that category

4. **AC4:** Cards match cie4 design (FR52)
   - **When** animations display
   - **Then** ActivityCard component is used
   - **And** design matches cie4

5. **AC5:** "Nouveau" badge shows (FR29)
   - **When** animation is < 7 days old
   - **Then** "Nouveau" badge displays

## Tasks / Subtasks

- [x] Task 1: Create animations list page route (AC: 1)
  - [x] Create `src/app/animations/page.tsx`
  - [x] Fetch published animations with Prisma
  - [x] Page is dynamic due to searchParams (server-side filtering)

- [x] Task 2: Configure filters (AC: 2, 3)
  - [x] Define school level filter options (NIVEAUX)
  - [x] Fetch animation categories for filter
  - [x] Implement server-side filtering via searchParams

- [x] Task 3: Build page layout (AC: 4, 5)
  - [x] Add PageHeader component
  - [x] Add FilterBar with Suspense wrapper
  - [x] Create responsive 3-column grid
  - [x] Use ActivityCard for display

- [x] Task 4: Add SEO and test (AC: 1-5)
  - [x] Configure metadata and OpenGraph
  - [x] Run `npm run build` successfully

## Dev Notes

### CRITICAL: Architecture Requirements

**From docs/planning-artifacts/prd.md:**

```
FR21: Visitor can browse Animations by school level
FR22: Visitor can browse Animations by category
FR29: "Nouveau" badge (< 7 days)
FR52: Exact card components from cie4
```

### School Levels

```typescript
const NIVEAUX = [
  { value: 'M1', label: 'Maternelle 1ère' },
  { value: 'M2/M3', label: 'Maternelle 2-3' },
  { value: 'P1-P2', label: 'Primaire 1-2' },
  { value: 'P3-P4', label: 'Primaire 3-4' },
  { value: 'P5-P6', label: 'Primaire 5-6' },
  { value: 'S1-S3', label: 'Secondaire 1-3' },
  { value: 'S4-S6', label: 'Secondaire 4-6' },
]
```

### References

- [Source: docs/planning-artifacts/prd.md#FR21-22] - Filter requirements
- [Source: prisma/schema.prisma] - Animation model

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

1. `src/app/animations/page.tsx` - Animations list page with filters
2. `src/app/animations/page.module.css` - Grid and empty state styles

**Key Features Implemented:**

- Server-side filtering via searchParams (niveau, categorie)
- Dynamic category filter from database
- Responsive 3-column grid (2 on tablet, 1 on mobile)
- Empty state for no results
- Results count display
- SEO metadata and OpenGraph

---

## Senior Developer Review (AI)

**Review Date:** 2026-02-01
**Outcome:** Approved

### Issues Found and Fixed

**No issues found**

### Notes

- Page is dynamic (ƒ) due to searchParams, which is correct for server-side filtering
- FilterBar wrapped in Suspense for proper hydration
- Uses ActivityCard with correct discriminated union type

---

## Change Log

| Date | Change | Reason |
|------|--------|--------|
| 2026-02-01 | Story created | First list page in Epic 5 |
| 2026-02-01 | Implementation complete | All tasks completed, build successful |
