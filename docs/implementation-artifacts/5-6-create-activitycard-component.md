# Story 5.6: Create ActivityCard Component for All Content Types

Status: done

## Story

As a **developer**,
I want **a unified card component for activities**,
So that **animations, formations, stages display consistently**.

## Acceptance Criteria

1. **AC1:** Component supports all content types
   - **Given** Animation, Formation, or Stage data
   - **When** ActivityCard renders
   - **Then** displays appropriate content for each type

2. **AC2:** Displays status badges (FR29-32)
   - **When** content is < 7 days old
   - **Then** "Nouveau" badge shows (FR29)
   - **When** places = 0 or isFull = true
   - **Then** "Complet" badge shows (FR30)
   - **When** places below threshold
   - **Then** "Dernières places" badge shows (FR31)
   - **When** no registration link yet
   - **Then** "Inscriptions bientôt" badge shows (FR32)

3. **AC3:** Matches cie4 card design (FR52)
   - **When** card renders
   - **Then** uses Card base component styling
   - **And** image, title, description, metadata display correctly

4. **AC4:** Is accessible
   - **When** card renders
   - **Then** images have alt text (NFR17)
   - **And** card is keyboard focusable via Link wrapper
   - **And** focus states are visible

## Tasks / Subtasks

- [x] Task 1: Create ActivityCard component (AC: 1, 3)
  - [x] Create `src/components/ui/ActivityCard.tsx`
  - [x] Create `src/components/ui/ActivityCard.module.css`
  - [x] Support Animation, Formation, Stage types
  - [x] Uses Link wrapper with Card-like styling

- [x] Task 2: Implement badge logic (AC: 2)
  - [x] Create `determineBadge` helper function
  - [x] Support "Nouveau" (< 7 days)
  - [x] Support "Complet" (isFull or placesLeft = 0)
  - [x] Support "Dernières places" (placesLeft <= 5)
  - [x] Support "Inscriptions bientôt" (no billetwebUrl)

- [x] Task 3: Add type-specific metadata display (AC: 1)
  - [x] Animation: niveau, category
  - [x] Formation: next date, places available
  - [x] Stage: age range, period, dates, price

- [x] Task 4: Ensure accessibility (AC: 4)
  - [x] Wrap in Link for keyboard navigation
  - [x] Ensure alt text on images (fallback to title)
  - [x] Run `npm run build` successfully

## Dev Notes

### CRITICAL: Architecture Requirements

**From docs/planning-artifacts/prd.md:**

```
FR29: "Nouveau" badge (< 7 days)
FR30: "Complet" badge (no places)
FR31: "Dernières places" badge (below threshold)
FR32: "Inscriptions bientôt" badge (no link yet)
FR52: Exact card components from cie4
NFR17: All images have alt text
```

### Content Type Interfaces

```typescript
type ActivityType = 'animation' | 'formation' | 'stage'

interface BaseActivity {
  id: string
  titre: string
  description: string
  createdAt: Date
  images: { url: string; alt: string | null }[]
  categorie?: { nom: string }
  tags: { nom: string }[]
}

interface AnimationActivity extends BaseActivity {
  type: 'animation'
  niveau: string
}

interface FormationActivity extends BaseActivity {
  type: 'formation'
  billetwebUrl: string | null
  placesLeft: number | null
  isFull: boolean
  dates: { dateDebut: Date }[]
}

interface StageActivity extends BaseActivity {
  type: 'stage'
  ageMin: number
  ageMax: number
  periode: string
  dateDebut: Date
  dateFin: Date
  prix: string
  billetwebUrl: string | null
  placesLeft: number | null
  isFull: boolean
}
```

### Badge Threshold

Default threshold for "Dernières places": 5 places remaining.

### References

- [Source: docs/planning-artifacts/prd.md#FR29-32] - Badge requirements
- [Source: cie4/style.css] - Card design

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

1. `src/components/ui/ActivityCard.tsx` - Unified activity card component
2. `src/components/ui/ActivityCard.module.css` - Card styles

**Files Modified:**

1. `src/components/ui/index.ts` - Added ActivityCard export

**Key Features Implemented:**

- Discriminated union type for Animation/Formation/Stage data
- Badge logic implementing FR29-32 (Nouveau, Complet, Dernières places, Inscriptions bientôt)
- Type-specific metadata display (AnimationMeta, FormationMeta, StageMeta)
- French date formatting with fr-BE locale
- Image with placeholder fallback
- Link wrapper for full card clickability
- Hover and focus states matching cie4 design

---

## Senior Developer Review (AI)

**Review Date:** 2026-02-01
**Outcome:** Approved (after cleanup)

### Issues Found and Fixed

**LOW Severity (2 fixed):**
- [x] L1: Unused `ActivityType` type - Removed
- [x] L2: Unused `TagData` interface - Removed

### Notes

- Badge priority is correct: availability badges (complet, dernieres-places, inscriptions-bientot) take precedence over "nouveau" for formations/stages
- Image alt text falls back to title if not provided
- Description truncated at 120 characters

---

## Change Log

| Date | Change | Reason |
|------|--------|--------|
| 2026-02-01 | Story created | Foundational component for Epic 5 |
| 2026-02-01 | Implementation complete | All tasks completed, build successful |
| 2026-02-01 | Code review cleanup | Removed unused type definitions |
