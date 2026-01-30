# Story 2.1: Create Admin Database Schema

Status: done

## Story

As a **developer**,
I want **the Admin and AuditLog tables defined in Prisma**,
So that **I can store admin credentials and track actions**.

## Acceptance Criteria

1. **AC1:** `Admin` table exists with `id`, `email`, `passwordHash`, `createdAt` (FR36)
2. **AC2:** `AuditLog` table exists with `id`, `adminId`, `action`, `entityType`, `entityId`, `timestamp` (FR38)
3. **AC3:** Migrations run successfully (`npx prisma db push`)

## Tasks / Subtasks

- [x] Task 1: Add Admin model to Prisma schema (AC: 1, 3)
  - [x] Open `prisma/schema.prisma`
  - [x] Add `Admin` model with fields: id (cuid), email (unique), passwordHash, createdAt
  - [x] Add index on email for login lookups

- [x] Task 2: Add AuditLog model to Prisma schema (AC: 2, 3)
  - [x] Add `AuditLog` model with fields: id (cuid), adminId, action, entity, entityId, details (optional), createdAt
  - [x] Add relation between AuditLog and Admin (optional for now, can be added later)
  - [x] Add index on createdAt for recent logs query

- [x] Task 3: Remove TestConnection model (AC: 3)
  - [x] Remove the TestConnection model (was only for Story 1.2 verification)

- [x] Task 4: Push schema and verify (AC: 3)
  - [x] Run `npx prisma db push` to apply changes
  - [x] Run `npx prisma generate` to regenerate client
  - [x] Verify `npm run build` passes

## Dev Notes

### CRITICAL: Source Files

**Architecture Admin Schema (docs/planning-artifacts/architecture.md:289-304):**
```prisma
model Admin {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
}

model AuditLog {
  id        String   @id @default(cuid())
  adminId   String
  action    String
  entity    String
  entityId  String
  details   String?
  createdAt DateTime @default(now())
}
```

### Field Mapping to Story ACs

| Story AC Field | Prisma Field | Notes |
|----------------|--------------|-------|
| Admin.id | id | cuid() auto-generated |
| Admin.email | email | @unique for login |
| Admin.passwordHash | passwordHash | bcrypt hash (Story 2.2) |
| Admin.createdAt | createdAt | @default(now()) |
| AuditLog.id | id | cuid() auto-generated |
| AuditLog.adminId | adminId | Reference to Admin |
| AuditLog.action | action | e.g., 'animation.created' |
| AuditLog.entityType | entity | e.g., 'Animation' |
| AuditLog.entityId | entityId | Entity's id |
| AuditLog.timestamp | createdAt | @default(now()) |

### Audit Event Naming Convention

From architecture (lines 623-631):
```typescript
// Naming: entity.action
'animation.created'
'animation.updated'
'animation.deleted'
'admin.login'
'billetweb.synced'
```

### Current Prisma Schema State

The schema currently has:
- SQLite datasource configured
- Prisma client output to `src/generated/prisma`
- TestConnection model (to be removed)

### What NOT to Do

- ❌ Do NOT add relation from AuditLog to Admin yet (will add when needed)
- ❌ Do NOT create API routes in this story (that's Story 2.2)
- ❌ Do NOT add password hashing logic (that's Story 2.2)
- ❌ Do NOT add the full content schema (that's Story 3.1)
- ❌ Do NOT forget to remove TestConnection model

### Testing Verification

To verify the implementation:

1. Run `npx prisma db push` - should complete without errors
2. Run `npx prisma generate` - should regenerate client
3. Run `npm run build` - should pass
4. Check `prisma/dev.db` has Admin and AuditLog tables (can use sqlite3 or Prisma Studio)
5. Optionally: `npx prisma studio` to view schema visually

### Prisma Commands Reference

```bash
# Push schema changes to database (development)
npx prisma db push

# Regenerate Prisma client
npx prisma generate

# View database in browser
npx prisma studio

# Create migration (for production - not needed now)
npx prisma migrate dev --name add-admin-schema
```

### File Structure After This Story

```
prisma/
├── schema.prisma         # MODIFIED: Added Admin and AuditLog models
└── dev.db                # MODIFIED: New tables created
```

### References

- [Source: docs/planning-artifacts/architecture.md:289-304] - Admin and AuditLog schema
- [Source: docs/planning-artifacts/architecture.md:623-631] - Audit event naming convention
- [Source: docs/planning-artifacts/epics.md:395-408] - Story requirements

---

## Previous Story Intelligence (Story 1.8)

### Key Learnings from Story 1.8

1. **forwardRef for form components**: Use forwardRef to allow parent ref access
2. **useId() for unique IDs**: Generate unique accessible IDs for form labels
3. **CSS Modules encapsulation**: Duplication is acceptable trade-off for encapsulation
4. **SelectOption type export**: Always export types that consumers need
5. **Browser compatibility**: Avoid :has() selector, use JS-based class instead

### Patterns Established

- 'use client' for any component with hooks or browser APIs
- CSS Modules for all component styling
- Barrel exports in index.ts
- forwardRef pattern for form components
- Consistent className handling via array join pattern

### Code Review Fixes from Story 1.8

- M1: Documented CSS duplication trade-off
- M2: Exported SelectOption type
- M3: Replaced :has() with JS-based class
- L1: Added accessibility documentation to FormField
- L2: Consistent className handling
- L3: Removed duplicate focus-visible rules

---

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- `npx prisma db push` - Completed in 166ms
- `npx prisma generate` - Generated Prisma Client 7.3.0 in 30ms
- `npm run build` - Compiled successfully

### Completion Notes List

1. **AC1 (Admin table):** Created Admin model with id (cuid), email (unique with index), passwordHash, createdAt. Added @@index([email]) for login lookups.

2. **AC2 (AuditLog table):** Created AuditLog model with id (cuid), adminId, action, entity, entityId, details (optional), createdAt. Added @@index([createdAt]) and @@index([adminId]) for query performance.

3. **AC3 (Migrations):** Successfully ran `npx prisma db push` - database in sync. Regenerated Prisma client. Build passes.

4. **Additional:** Updated scripts/test-db.ts to use Admin/AuditLog models instead of removed TestConnection model.

### Code Review Fixes

| ID | Severity | Issue | Fix Applied |
|----|----------|-------|-------------|
| L1 | LOW | Admin missing updatedAt field | Added `updatedAt DateTime @updatedAt` to Admin model |

### Change Log

| Date | Change | Reason |
|------|--------|--------|
| 2026-01-26 | Added Admin and AuditLog models to schema.prisma | Task 1, 2 |
| 2026-01-26 | Removed TestConnection model | Task 3 |
| 2026-01-26 | Updated test-db.ts to use new models | Build fix |
| 2026-01-26 | Added updatedAt to Admin model | Code Review L1 |

### File List

**Created:**
(none)

**Modified:**
- prisma/schema.prisma - Added Admin and AuditLog models, removed TestConnection
- scripts/test-db.ts - Updated to test Admin/AuditLog tables instead of TestConnection
