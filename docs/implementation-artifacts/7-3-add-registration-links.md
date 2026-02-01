# Story 7.3: Add Registration Links to Content

Status: done

## Story

As a **visitor**,
I want **to click a link to register on Billetweb**,
So that **I can sign up for activities**.

## Acceptance Criteria

1. **AC1:** Registration link opens Billetweb in new tab (FR20)
   - **Given** content has Billetweb link
   - **When** registration link is displayed
   - **Then** link opens Billetweb in new tab

2. **AC2:** Link styled as primary button
   - **Given** registration link is displayed
   - **When** viewing the content
   - **Then** link has primary button styling

3. **AC3:** Link is accessible
   - **Given** registration link is displayed
   - **When** screen reader reads the link
   - **Then** appropriate aria-label describes the action

## Tasks / Subtasks

- [x] Task 1: Create RegistrationLink component
  - [x] Create `src/components/ui/RegistrationLink.tsx`
  - [x] Implement logic for billetwebUrl, isFull, and no URL states
  - [x] Add aria-labels for accessibility
  - [x] Style as primary button using Button.module.css

- [x] Task 2: Export RegistrationLink
  - [x] Add export to `src/components/ui/index.ts`

- [x] Task 3: Update Formation detail page
  - [x] Import RegistrationLink and badge-service
  - [x] Replace inline badge logic with getPrimaryBadge
  - [x] Replace inline registration link with RegistrationLink component

- [x] Task 4: Update Stage detail page
  - [x] Import RegistrationLink and badge-service
  - [x] Replace inline badge logic with getPrimaryBadge
  - [x] Replace inline registration link with RegistrationLink component

- [x] Task 5: Verify build
  - [x] Run `npm run build` successfully

## Dev Notes

### RegistrationLink States

| State | Display | Target |
|-------|---------|--------|
| isFull = true | "Complet" (disabled) | None |
| billetwebUrl set | "S'inscrire" | Billetweb (new tab) |
| No billetwebUrl | "Nous contacter" | /contact |

### Accessibility Labels

```typescript
// Full state
aria-label={`Inscriptions complètes pour ${activityTitle}`}

// Has URL
aria-label={`S'inscrire à ${typeLabel} ${activityTitle} (ouvre Billetweb dans un nouvel onglet)`}

// No URL
aria-label={`Contacter le CIE pour plus d'informations sur ${activityTitle}`}
```

### References

- [Source: docs/planning-artifacts/epics.md#Story 7.3]
- [Source: docs/planning-artifacts/epics.md#FR20]

---

## Change Log

| Date | Change | Reason |
|------|--------|--------|
| 2026-02-01 | Story created | Third story in Epic 7 |
| 2026-02-01 | Implementation complete | All tasks done |
| 2026-02-01 | Code review passed | Fixed H1 (aria-disabled), H2 (tests), M1 (URL validation) |

## Dev Agent Record

### File List

- `src/components/ui/RegistrationLink.tsx` - Created: Registration link component with accessibility
- `src/components/ui/RegistrationLink.test.ts` - Created: URL validation tests (12 tests)
- `src/components/ui/index.ts` - Modified: Added RegistrationLink export
- `src/app/formations/[id]/page.tsx` - Modified: Uses badge-service and RegistrationLink
- `src/app/stages/[id]/page.tsx` - Modified: Uses badge-service and RegistrationLink

### Code Review Fixes Applied

- **H1**: Added `role="button"` and `aria-disabled="true"` to disabled span (WCAG 4.1.2)
- **H2**: Created unit tests for URL validation logic (12 test cases)
- **M1**: Added `isValidExternalUrl()` to validate Billetweb URLs before rendering
