# Story 7.2: Implement Automatic Status Badge Logic

Status: done

## Story

As a **visitor**,
I want **to see accurate status badges on content**,
So that **I know availability at a glance**.

## Acceptance Criteria

1. **AC1:** "Nouveau" badge shows for recent content (FR29)
   - **Given** content was created less than 7 days ago
   - **When** displaying content card
   - **Then** "Nouveau" badge is displayed

2. **AC2:** "Complet" badge shows when no places left (FR30)
   - **Given** Billetweb sync shows places = 0
   - **When** displaying Formation/Stage
   - **Then** "Complet" badge is displayed

3. **AC3:** "Dernières places" badge shows when below threshold (FR31)
   - **Given** places remaining < threshold (e.g., 5)
   - **When** displaying Formation/Stage
   - **Then** "Dernières places" badge is displayed

4. **AC4:** "Inscriptions bientôt" badge shows when no link yet (FR32)
   - **Given** Formation/Stage has no billetwebUrl
   - **When** displaying content
   - **Then** "Inscriptions bientôt" badge is displayed

5. **AC5:** Badges update automatically (FR19)
   - **Given** Billetweb sync runs
   - **When** places data changes
   - **Then** badge status reflects new data on next page load

## Tasks / Subtasks

- [x] Task 1: Create badge service (AC: 1-5)
  - [x] Create `src/lib/services/badge-service.ts`
  - [x] Implement `getBadges(entity)` function
  - [x] Define badge types and priority order

- [x] Task 2: Create Badge UI component
  - [x] Badge.tsx already exists with all variants
  - [x] Badge variants: nouveau, complet, dernieres-places, inscriptions-bientot
  - [x] Styled with CSS variables in Badge.module.css

- [x] Task 3: Badge priority logic
  - [x] Priority handled in badge-service.ts (complet > dernières places > nouveau > inscriptions)
  - [x] getPrimaryBadge() returns highest priority badge
  - [x] getAllBadges() returns all applicable badges sorted

- [x] Task 4: Integrate with existing cards
  - [x] ActivityCard.tsx updated to use badge-service
  - [x] ActivityCard handles all content types (animations, formations, stages)

- [x] Task 5: Verify build
  - [x] Run `npm run build` successfully

## Dev Notes

### Badge Types and Priority

| Badge | Condition | Priority | Color |
|-------|-----------|----------|-------|
| Complet | placesLeft === 0 | 1 (highest) | Red |
| Dernières places | placesLeft > 0 && placesLeft < threshold | 2 | Orange |
| Nouveau | createdAt < 7 days ago | 3 | Green |
| Inscriptions bientôt | !billetwebUrl && has dates | 4 | Blue |

### Badge Service Interface

```typescript
interface BadgeInfo {
  type: 'nouveau' | 'complet' | 'dernieres-places' | 'inscriptions-bientot'
  label: string
  priority: number
}

function getBadges(entity: Formation | Stage): BadgeInfo[]
```

### Threshold Configuration

```typescript
const BADGE_CONFIG = {
  NOUVEAU_DAYS: 7,
  DERNIERES_PLACES_THRESHOLD: 5
}
```

### CSS Variables (from cie4)

```css
/* Badge colors */
--badge-nouveau: var(--L-sapin);
--badge-complet: var(--L-error, #dc2626);
--badge-dernieres: var(--L-warning, #f59e0b);
--badge-inscriptions: var(--L-info, #3b82f6);
```

### References

- [Source: docs/planning-artifacts/architecture.md#Service Boundaries - badge-service.ts]
- [Source: docs/planning-artifacts/epics.md#Story 7.2]
- [Source: docs/planning-artifacts/epics.md#FR29-FR32]

---

## Change Log

| Date | Change | Reason |
|------|--------|--------|
| 2026-02-01 | Story created | Second story in Epic 7 |
| 2026-02-01 | Implementation complete | Badge service extracted, ActivityCard updated |
| 2026-02-01 | Code review passed | No fixes needed, all ACs verified |

## Dev Agent Record

### File List

- `src/lib/services/badge-service.ts` - Created: Badge logic service with priority handling
- `src/components/ui/ActivityCard.tsx` - Modified: Uses badge-service instead of inline logic
- `src/components/ui/Badge.tsx` - Existing: Already had all badge variants
- `src/components/ui/Badge.module.css` - Existing: Already styled
