# Story 5.2: Build Formations List Page with Filters

Status: done

## Story

As a **visitor**,
I want **to browse formations by category**,
So that **I can find adult training that interests me**.

## Acceptance Criteria

1. **AC1:** List displays published formations
   - **Given** formations exist in database
   - **When** page loads
   - **Then** only published formations display

2. **AC2:** Filter by category works (FR23)
   - **When** visitor selects a category
   - **Then** list filters to that category
   - **And** URL updates with filter

3. **AC3:** Status badges show (FR29-32)
   - **When** formations display
   - **Then** appropriate badges show (Nouveau, Complet, etc.)

## Tasks / Subtasks

- [x] Task 1: Create formations list page route (AC: 1)
  - [x] Create `src/app/formations/page.tsx`
  - [x] Fetch published formations with Prisma
  - [x] Include upcoming dates for next session display

- [x] Task 2: Configure filters (AC: 2)
  - [x] Fetch formation categories for filter
  - [x] Implement server-side filtering

- [x] Task 3: Build page layout (AC: 3)
  - [x] Add PageHeader component
  - [x] Add FilterBar with chips
  - [x] Use ActivityCard for display

- [x] Task 4: Add SEO and test (AC: 1-3)
  - [x] Configure metadata
  - [x] Run `npm run build` successfully

## Dev Notes

### CRITICAL: Architecture Requirements

**From docs/planning-artifacts/prd.md:**

```
FR23: Visitor can browse Formations by category
FR29-32: Status badges
```

### References

- [Source: docs/planning-artifacts/prd.md#FR23] - Filter requirements
- [Source: prisma/schema.prisma] - Formation model

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

1. `src/app/formations/page.tsx` - Formations list page
2. `src/app/formations/page.module.css` - Grid and empty state styles

**Key Features Implemented:**

- Server-side category filtering
- Fetches upcoming dates for next session display
- Status badges via ActivityCard (Nouveau, Complet, etc.)
- SEO metadata

---

## Senior Developer Review (AI)

**Review Date:** 2026-02-01
**Outcome:** Approved

### Notes

- Follows same pattern as animations page
- Only fetches future dates for display
- Proper handling of billetwebUrl, placesLeft, isFull for badges

---

## Change Log

| Date | Change | Reason |
|------|--------|--------|
| 2026-02-01 | Story created | Second list page in Epic 5 |
| 2026-02-01 | Implementation complete | All tasks completed, build successful |
