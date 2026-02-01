# Story 4.2: Create About Page (CIE)

Status: done

## Story

As a **visitor**,
I want **to learn about the CIE organization**,
So that **I understand their mission and team**.

## Acceptance Criteria

1. **AC1:** Page matches cie4/cie.html exactly (FR46)
   - **Given** layout components exist
   - **When** about page is built
   - **Then** visual design matches reference exactly
   - **And** responsive behavior is consistent

2. **AC2:** Page header with title
   - **When** visitor lands on about page
   - **Then** page header displays with "Le CIE d'Enghien" title
   - **And** subtitle "Centre d'Initiation à l'Environnement"

3. **AC3:** Mission section ("Qui sommes-nous")
   - **When** page renders
   - **Then** mission text displays with proper styling
   - **And** blockquote with Chesterton quote
   - **And** placeholder image for CIE photo

4. **AC4:** Team section
   - **When** page renders
   - **Then** 3 animator cards display with photos/placeholders
   - **And** 2 CA member cards display
   - **And** proper grid layout with hover effects

5. **AC5:** Park section ("Le Parc d'Enghien")
   - **When** page renders
   - **Then** park description displays
   - **And** reversed grid layout (image left, text right)
   - **And** placeholder image for park photo

6. **AC6:** Call to action section
   - **When** page renders
   - **Then** CTA buttons link to animations and contact pages

## Tasks / Subtasks

- [x] Task 1: Create about page route (AC: 1)
  - [x] Create `src/app/cie/page.tsx`
  - [x] Add proper metadata for SEO
  - [x] Configure ISR with 60s revalidation

- [x] Task 2: Create PageHeader component (AC: 2)
  - [x] Create `src/components/sections/PageHeader.tsx`
  - [x] Smaller hero variant with title/subtitle
  - [x] Styled with gradient background matching cie4

- [x] Task 3: Create AboutMission section (AC: 3)
  - [x] Create `src/components/sections/AboutMission.tsx`
  - [x] Add mission text and blockquote
  - [x] Add placeholder image

- [x] Task 4: Create TeamSection component (AC: 4)
  - [x] Create `src/components/sections/TeamSection.tsx`
  - [x] Create TeamCard styling
  - [x] Display 3 animators + 2 CA members
  - [x] Responsive grid layout

- [x] Task 5: Create ParkSection component (AC: 5)
  - [x] Create `src/components/sections/ParkSection.tsx`
  - [x] Reversed grid layout (image left)
  - [x] Park description text

- [x] Task 6: Create CallToAction component (AC: 6)
  - [x] Create `src/components/sections/CallToAction.tsx`
  - [x] Reusable CTA section with buttons

- [x] Task 7: Assemble about page and test (AC: 1-6)
  - [x] Combine all sections in page.tsx
  - [x] Test responsive behavior
  - [x] Verify design match with cie4/cie.html
  - [x] Run `npm run build` successfully

## Dev Notes

### CRITICAL: Architecture Requirements

**From docs/planning-artifacts/prd.md:**

```
FR46: Design matches cie4 mockup exactly
```

### Reference Design

The cie4/cie.html contains the exact layout to replicate:
- Page header (smaller hero)
- "Qui sommes-nous" mission section
- Team section with animator and CA cards
- "Le Parc d'Enghien" section (reversed layout)
- Call to action section
- Footer (already exists)

### Team Data

**Animators:**
1. Aurore Berger - Coordinatrice
2. Théo Raevens - Animateur
3. Flora Morelle - Animatrice

**Conseil d'Administration:**
1. Muriel Mozelsio - Présidente
2. Grégory Michel - Vice-président

### CSS Specific to Page

The cie4/cie.html includes inline styles for:
- `.team-grid` - 3-column grid for animators
- `.team-card` - Card styling with hover
- `.team-role` - Role styling (uppercase, primary color)
- `.ca-grid` - Flexbox for CA members
- `.ca-card` - Smaller card variant

### References

- [Source: cie4/cie.html] - Reference design
- [Source: cie4/style.css] - Reference styles
- [Source: docs/planning-artifacts/prd.md#FR46] - Design match requirement

---

## Previous Story Intelligence

### Key Learnings from Story 4.1

1. **Section Components:** Use sections barrel export
2. **French Content:** All text in French
3. **ISR:** Use `export const revalidate = 60`
4. **Section id:** Add id prop to Section component

### Files Created in Story 4.1

- `src/components/sections/Presentation.tsx` - Can reuse pattern
- `src/components/sections/index.ts` - Add new exports

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

1. `src/app/cie/page.tsx` - About page route with ISR
2. `src/components/sections/PageHeader.tsx` - Page header component
3. `src/components/sections/PageHeader.module.css` - Page header styles
4. `src/components/sections/AboutMission.tsx` - Mission section
5. `src/components/sections/AboutMission.module.css` - Mission styles
6. `src/components/sections/TeamSection.tsx` - Team section with cards
7. `src/components/sections/TeamSection.module.css` - Team styles
8. `src/components/sections/ParkSection.tsx` - Park section
9. `src/components/sections/ParkSection.module.css` - Park styles
10. `src/components/sections/CallToAction.tsx` - Reusable CTA component
11. `src/components/sections/CallToAction.module.css` - CTA styles

**Files Modified:**

1. `src/components/sections/index.ts` - Added new exports

**Key Features Implemented:**

- ISR with 60s revalidation
- PageHeader component for subpages
- Mission section with blockquote
- Team section with animator and CA grids
- Park section with reversed layout
- Reusable CallToAction component
- SEO metadata
- French language throughout
- Responsive design with CSS Modules
- ScrollReveal animations

---

## Senior Developer Review (AI)

**Review Date:** 2026-02-01
**Outcome:** Approved

### Issues Found

**No HIGH or MEDIUM severity issues found.**

**LOW Severity (deferred):**
- [ ] L1: Team photos are placeholders - To be replaced with actual photos
- [ ] L2: Skip-link target for page header - Will be addressed in Story 4.4

### Notes

- Code follows established patterns from Story 4-1
- Components are reusable and well-structured
- All French text with proper accents
- Responsive breakpoints consistent with cie4

---

## Change Log

| Date | Change | Reason |
|------|--------|--------|
| 2026-02-01 | Story created | Second story in Epic 4 after 4-1 completion |
| 2026-02-01 | Implementation complete | All tasks completed, build successful |
