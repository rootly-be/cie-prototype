# Story 5.3: Build Stages List Page with Filters

Status: done

## Story

As a **visitor**,
I want **to browse stages by age group and period**,
So that **I can find a camp for my child**.

## Acceptance Criteria

1. **AC1:** List displays published stages
   - **Given** stages exist in database
   - **When** page loads
   - **Then** only published stages display

2. **AC2:** Filter by age group works (FR24)
   - **When** visitor selects an age group
   - **Then** list filters to matching stages

3. **AC3:** Filter by period/season works (FR25)
   - **When** visitor selects a period
   - **Then** list filters to that period

4. **AC4:** Status badges show (FR29-32)
   - **When** stages display
   - **Then** appropriate badges show

## Tasks / Subtasks

- [x] Task 1: Create stages list page route (AC: 1)
  - [x] Create `src/app/stages/page.tsx`
  - [x] Fetch published stages with Prisma

- [x] Task 2: Configure filters (AC: 2, 3)
  - [x] Define age group filter options (4 groups)
  - [x] Define period filter options (4 seasons)
  - [x] Implement age range overlap filtering

- [x] Task 3: Build page layout (AC: 4)
  - [x] Add PageHeader component
  - [x] Add FilterBar (chips + select)
  - [x] Use ActivityCard for display

- [x] Task 4: Add SEO and test
  - [x] Configure metadata
  - [x] Run `npm run build` successfully

## Dev Notes

### Age Groups

```typescript
const AGE_GROUPS = [
  { value: '3-5', label: '3-5 ans' },
  { value: '6-9', label: '6-9 ans' },
  { value: '10-12', label: '10-12 ans' },
  { value: '13-16', label: '13-16 ans' },
]
```

### Periods

```typescript
const PERIODES = [
  { value: 'Carnaval', label: 'Carnaval' },
  { value: 'Pâques', label: 'Pâques' },
  { value: 'Été', label: 'Été' },
  { value: 'Toussaint', label: 'Toussaint' },
]
```

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

1. `src/app/stages/page.tsx` - Stages list page
2. `src/app/stages/page.module.css` - Grid and empty state styles

**Key Features Implemented:**

- Age group filtering with range overlap logic (ageMin/ageMax)
- Period/season filtering
- Ordered by dateDebut ascending (upcoming first)
- Status badges via ActivityCard

---

## Senior Developer Review (AI)

**Review Date:** 2026-02-01
**Outcome:** Approved

### Notes

- Age filter uses range overlap: stage ageMin <= group max AND ageMax >= group min
- Combines chips (age) and select (period) filter types

---

## Change Log

| Date | Change | Reason |
|------|--------|--------|
| 2026-02-01 | Story created | Third list page in Epic 5 |
| 2026-02-01 | Implementation complete | All tasks completed, build successful |
