# Story 3.7: Build Admin Content List and Form Pages

Status: done

## Story

As an **admin**,
I want **UI pages to manage all content**,
So that **I can use the backoffice without API knowledge**.

## Acceptance Criteria

1. **AC1:** List pages with filters
   - **Given** CRUD APIs exist
   - **When** admin navigates to content list pages
   - **Then** animations, formations, stages are displayed in tables
   - **And** filters for category, tags, status are available
   - **And** pagination works correctly

2. **AC2:** Form pages for create/edit
   - **When** admin clicks "Create" or "Edit"
   - **Then** form displays with all required fields
   - **And** validation messages appear for invalid data
   - **And** category and tag selects are populated from API

3. **AC3:** Preview before publish (FR11)
   - **When** admin fills out form
   - **Then** preview section shows how content will appear
   - **And** admin can review before saving

4. **AC4:** Publish/unpublish toggle (FR12)
   - **When** admin views content
   - **Then** publish toggle allows instant status change
   - **And** published content shows visual indicator

5. **AC5:** CIE4 styling (FR53)
   - **When** admin pages are displayed
   - **Then** forms use cie4 design variables
   - **And** components match existing UI system

## Tasks / Subtasks

- [x] Task 1: Create admin layout with sidebar navigation (AC: 5)
  - [x] Create `src/app/admin/layout.tsx` with admin shell
  - [x] Create admin sidebar component with navigation
  - [x] Add navigation links to Animations, Formations, Stages
  - [x] Style with cie4 variables

- [x] Task 2: Build animations list page (AC: 1, 4)
  - [x] Create `src/app/admin/animations/page.tsx`
  - [x] Add data table with columns: title, niveau, category, status
  - [x] Add filters for niveau, category, published status
  - [x] Add publish/unpublish quick toggle
  - [x] Add create/edit/delete actions

- [x] Task 3: Build animation form page (AC: 2, 3, 5)
  - [x] Create `src/app/admin/animations/[id]/page.tsx` for edit
  - [x] Create `src/app/admin/animations/new/page.tsx` for create
  - [x] Add form fields: titre, description, niveau, category, tags
  - [x] Add live preview section
  - [x] Implement form validation

- [x] Task 4: Build formations list page (AC: 1, 4)
  - [x] Create `src/app/admin/formations/page.tsx`
  - [x] Add data table with columns: title, category, dates, status
  - [x] Add filters for category, published status, isFull
  - [x] Add publish/unpublish quick toggle

- [x] Task 5: Build formation form page (AC: 2, 3, 5)
  - [x] Create `src/app/admin/formations/[id]/page.tsx` for edit
  - [x] Create `src/app/admin/formations/new/page.tsx` for create
  - [x] Add form fields including isFull toggle
  - [x] Add live preview section

- [x] Task 6: Build stages list page (AC: 1, 4)
  - [x] Create `src/app/admin/stages/page.tsx`
  - [x] Add data table with columns: title, periode, ages, dates, status
  - [x] Add filters for periode, published status, isFull

- [x] Task 7: Build stage form page (AC: 2, 3, 5)
  - [x] Create `src/app/admin/stages/[id]/page.tsx` for edit
  - [x] Create `src/app/admin/stages/new/page.tsx` for create
  - [x] Add form fields including date range, age range, prix
  - [x] Add live preview section

- [x] Task 8: Create shared admin components (AC: 5)
  - [x] Create StatusToggle component for publish/unpublish
  - [x] Create ContentPreview component for preview mode
  - [x] Create admin-specific styles (admin.module.css)

- [x] Task 9: Integration testing (AC: 1, 2, 3, 4, 5)
  - [x] Run `npm run build` successfully

## Dev Notes

### CRITICAL: Architecture Requirements

**From docs/planning-artifacts/architecture.md:**

```
FR11: Admin can preview before publishing
FR12: Admin can publish/unpublish content
FR53: Exact form styling (cie4 design system)
```

### Existing Components to Use

- `Button`, `Input`, `Textarea`, `Select` from `@/components/ui`
- `Container`, `Section` from `@/components/layout`
- `Badge` for status indicators
- `Card` for content preview

### API Endpoints Available

- `GET/POST /api/admin/animations` - List/Create
- `GET/PUT/DELETE /api/admin/animations/[id]` - Read/Update/Delete
- `GET/POST /api/admin/formations` - List/Create
- `GET/PUT/DELETE /api/admin/formations/[id]` - Read/Update/Delete
- `GET/POST /api/admin/stages` - List/Create
- `GET/PUT/DELETE /api/admin/stages/[id]` - Read/Update/Delete
- `GET /api/admin/categories` - For select dropdowns
- `GET /api/admin/tags` - For multi-select

### Admin Layout Structure

```
/admin
  /animations          - List all animations
    /new              - Create animation
    /[id]             - Edit animation
  /formations         - List all formations
    /new              - Create formation
    /[id]             - Edit formation
  /stages             - List all stages
    /new              - Create stage
    /[id]             - Edit stage
```

### Styling Guidelines

Use CSS Modules with cie4 variables:
- `--color-primary` for headings
- `--bg-card` for form containers
- `--border-main` for inputs
- `--text-muted` for labels
- `--color-accent` for hover states

### References

- [Source: docs/planning-artifacts/prd.md#FR11] - Preview before publish
- [Source: docs/planning-artifacts/prd.md#FR12] - Publish/unpublish toggle
- [Source: docs/planning-artifacts/prd.md#FR53] - CIE4 form styling

---

## Previous Story Intelligence

### Key Learnings from Story 3.6

1. **Auth Pattern:** Use `getAdminFromRequest` for server components
2. **Error Handling:** Consistent `{ error: { code, message } }` format
3. **French Messages:** All user-facing text in French
4. **API Response:** `{ data: ... }` wrapper for success

### Files Created in Previous Stories

- `src/lib/auth.ts` - Authentication utilities
- `src/lib/prisma.ts` - Prisma client
- `src/lib/constants.ts` - Error codes and audit actions
- `src/components/ui/*` - Base UI components
- `src/app/api/admin/*` - All CRUD API routes

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

1. `src/app/admin/layout.tsx` - Admin layout with sidebar navigation
2. `src/app/admin/admin.module.css` - Comprehensive admin styles
3. `src/app/admin/page.tsx` - Dashboard with stats cards
4. `src/app/admin/animations/page.tsx` - Animations list with filters
5. `src/app/admin/animations/new/page.tsx` - Create animation form
6. `src/app/admin/animations/[id]/page.tsx` - Edit animation form
7. `src/app/admin/formations/page.tsx` - Formations list with filters
8. `src/app/admin/formations/new/page.tsx` - Create formation form
9. `src/app/admin/formations/[id]/page.tsx` - Edit formation form
10. `src/app/admin/stages/page.tsx` - Stages list with filters
11. `src/app/admin/stages/new/page.tsx` - Create stage form
12. `src/app/admin/stages/[id]/page.tsx` - Edit stage form
13. `src/components/admin/StatusToggle.tsx` - Publish toggle component
14. `src/components/admin/ContentPreview.tsx` - Live preview component
15. `src/components/admin/admin-components.module.css` - Admin component styles
16. `src/components/admin/index.ts` - Barrel export

**Key Features Implemented:**
- Sidebar navigation with active state highlighting
- Dashboard with content statistics
- List pages with filters (niveau, periode, category, status, isFull)
- Pagination support
- StatusToggle for quick publish/unpublish
- ContentPreview for live form preview (FR11)
- Form validation with error messages in French
- Delete confirmation dialogs
- Loading and empty states
- CIE4 design system variables throughout (FR53)

---

## Senior Developer Review (AI)

**Review Date:** 2026-02-01
**Outcome:** Approved (after fixes)

### Issues Found and Fixed

**HIGH Severity (3 fixed):**
- [x] H1: Missing error handling for category/tag fetch - Added `.catch()` to all Promise.all in form pages
- [x] H2: StatusToggle doesn't revert on error - Added optimistic update with rollback pattern
- [x] H3: NIVEAUX array duplicated - Created shared `src/lib/constants/niveaux.ts`

**MEDIUM Severity (4 fixed):**
- [x] M1: Unused Badge import - Removed from animations list page
- [x] M2: Unused interface properties - Cleaned up Animation interface
- [x] M3: Missing aria-busy on toggle - Added aria-busy and aria-invalid attributes
- [x] M4: Toggle error visual feedback - Added error state with shake animation

**LOW Severity (2 not fixed - acceptable):**
- [ ] L1: No unit tests for admin components - Deferred (post-MVP)
- [ ] L2: Delete uses native confirm() - Acceptable for MVP admin interface

### Files Modified During Review

- `src/lib/constants/niveaux.ts` (created) - Shared NIVEAUX constants
- `src/components/admin/StatusToggle.tsx` - Added rollback on error
- `src/components/admin/admin-components.module.css` - Added error styles
- `src/app/admin/animations/page.tsx` - Fixed imports
- `src/app/admin/animations/new/page.tsx` - Fixed imports, error handling
- `src/app/admin/animations/[id]/page.tsx` - Fixed imports, error handling
- `src/app/admin/formations/new/page.tsx` - Added error handling
- `src/app/admin/formations/[id]/page.tsx` - Added error handling
- `src/app/admin/stages/new/page.tsx` - Added error handling
- `src/app/admin/stages/[id]/page.tsx` - Added error handling

---

## Change Log

| Date | Change | Reason |
|------|--------|--------|
| 2026-02-01 | Story created | Seventh story in Epic 3 after 3.6 completion |
| 2026-02-01 | Implementation complete | All tasks completed, build successful |
| 2026-02-01 | Code review fixes | Fixed 7 issues (3 HIGH, 4 MEDIUM), created shared constants |
