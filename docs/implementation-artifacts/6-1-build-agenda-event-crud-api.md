# Story 6.1: Build Agenda Event CRUD API

Status: done

## Story

As an **admin**,
I want **API endpoints to manage standalone Agenda events**,
So that **I can add events not linked to formations/stages**.

## Acceptance Criteria

1. **AC1:** CRUD for manual events works (FR4, FR16)
   - **Given** admin is authenticated
   - **When** calling /api/admin/agenda endpoints
   - **Then** create, read, update, delete work

2. **AC2:** Events have required fields
   - **When** creating event
   - **Then** date, titre, lieu are validated

3. **AC3:** Events can have tags with colors (FR8)
   - **When** event is created/updated
   - **Then** tags can be attached

4. **AC4:** Mutations are logged (FR38)
   - **When** event is created/updated/deleted
   - **Then** audit log entry is created

## Tasks / Subtasks

- [x] Task 1: Create validation schemas (AC: 2)
  - [x] Create `src/lib/validations/agenda.ts`
  - [x] Define create, update, query schemas

- [x] Task 2: Add audit action constants (AC: 4)
  - [x] Update `src/lib/constants.ts`

- [x] Task 3: Create admin CRUD API (AC: 1, 3, 4)
  - [x] Create `src/app/api/admin/agenda/route.ts` (GET, POST)
  - [x] Create `src/app/api/admin/agenda/[id]/route.ts` (GET, PUT, DELETE)

- [x] Task 4: Create public API (AC: 1)
  - [x] Create `src/app/api/agenda/route.ts` (GET only)
  - [x] Run `npm run build` successfully

## Dev Agent Record

### File List
- `src/lib/validations/agenda.ts` - Created: Zod validation schemas for agenda events
- `src/lib/constants.ts` - Modified: Added AGENDA_EVENT_CREATED/UPDATED/DELETED audit actions
- `src/app/api/admin/agenda/route.ts` - Created: Admin GET (list) and POST endpoints
- `src/app/api/admin/agenda/[id]/route.ts` - Created: Admin GET (single), PUT, DELETE endpoints
- `src/app/api/agenda/route.ts` - Created: Public GET endpoint (published events only)

## Dev Notes

### AgendaEvent Model (from schema.prisma)

```prisma
model AgendaEvent {
  id         String    @id @default(cuid())
  titre      String
  date       DateTime
  dateFin    DateTime?
  lieu       String?
  sourceType String?   // 'formation', 'stage', 'manual'
  sourceId   String?   // ID of linked Formation or Stage
  published  Boolean   @default(false)
  tags       Tag[]     @relation("AgendaEventTags")
}
```

---

## Change Log

| Date | Change | Reason |
|------|--------|--------|
| 2026-02-01 | Story created | First story in Epic 6 |
| 2026-02-01 | Implementation complete | All CRUD endpoints implemented |
| 2026-02-01 | Code review fixes | Fixed AC2 typo, added dateFin validation, consistent logging |
