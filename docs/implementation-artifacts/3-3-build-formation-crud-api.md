# Story 3.3: Build Formation CRUD API

Status: done

## Story

As an **admin**,
I want **API endpoints to manage Formations**,
So that **I can create, read, update, delete adult trainings**.

## Acceptance Criteria

1. **AC1:** Admin list endpoint
   - **Given** database schema exists (Story 3.1)
   - **When** Formation API is created
   - **Then** `GET /api/admin/formations` returns paginated list (FR2)

2. **AC2:** Admin create endpoint
   - **And** `POST /api/admin/formations` creates with Zod validation
   - **And** validation enforces required fields
   - **And** creation logs to AuditLog (FR38)
   - **And** dates can be attached (FormationDate relation) (FR14)

3. **AC3:** Admin update/delete endpoints
   - **And** `PUT /api/admin/formations/[id]` updates
   - **And** `DELETE /api/admin/formations/[id]` soft-deletes (sets published=false)
   - **And** `isFull` flag can be set manually (FR13)
   - **And** all mutations are logged to AuditLog (FR38)

4. **AC4:** Public endpoints
   - **And** `GET /api/formations` returns published formations only
   - **And** filters work for category, tags (FR22, FR27)
   - **And** dates are included in response (FR14)

## Tasks / Subtasks

- [x] Task 1: Create validation schemas (AC: 2, 4)
  - [x] Create `src/lib/validations/formation.ts`
  - [x] Define `formationCreateSchema` (titre, description, categorieId, isFull, tagIds, imageIds, dateIds)
  - [x] Define `formationUpdateSchema` (all fields optional)
  - [x] Define `formationQuerySchema` (pagination, filters, sorting)
  - [x] Export TypeScript types for each schema

- [x] Task 2: Create admin list endpoint (AC: 1)
  - [x] Create `src/app/api/admin/formations/route.ts`
  - [x] Implement GET handler with pagination (page, pageSize)
  - [x] Add filters (categorieId, tagIds, published, isFull)
  - [x] Include relations (categorie, tags, images, dates)
  - [x] Return data + meta (total, page, totalPages)

- [x] Task 3: Create admin create endpoint (AC: 2)
  - [x] Implement POST handler in `route.ts`
  - [x] Validate request body with formationCreateSchema
  - [x] Extract admin context from middleware headers
  - [x] Create formation with createdById
  - [x] Connect tags, images, and dates relations
  - [x] Create audit log entry (FORMATION_CREATED)
  - [x] Return created formation with 201 status

- [x] Task 4: Create admin detail/update/delete endpoints (AC: 3)
  - [x] Create `src/app/api/admin/formations/[id]/route.ts`
  - [x] Implement GET handler (single formation with relations)
  - [x] Implement PUT handler (validate, update, audit log)
  - [x] Implement DELETE handler (soft-delete: published=false, audit log)
  - [x] Handle 404 for non-existent formations

- [x] Task 5: Create public endpoints (AC: 4)
  - [x] Create `src/app/api/formations/route.ts` (GET list, published only)
  - [x] Create `src/app/api/formations/[id]/route.ts` (GET detail, published only)
  - [x] Add same filters as admin endpoint
  - [x] Include dates in response
  - [x] Exclude admin-only fields (createdById, updatedById)

- [x] Task 6: Error handling (AC: 1, 2, 3, 4)
  - [x] Handle Zod validation errors (400)
  - [x] Handle Prisma P2025 not found (404)
  - [x] Handle Prisma P2003 foreign key constraint (400)
  - [x] Handle generic server errors (500)
  - [x] Sanitized logging (no sensitive data)

- [x] Task 7: Integration testing (AC: 1, 2, 3, 4)
  - [x] Test POST creates formation with relations
  - [x] Test GET list with pagination and filters
  - [x] Test PUT updates formation including isFull flag
  - [x] Test DELETE soft-deletes
  - [x] Test audit logs created
  - [x] Test public endpoints only show published
  - [x] Run `npm run build` successfully

## Dev Notes

### CRITICAL: Source Files

**Epic Source (docs/planning-artifacts/epics.md):**
```
Story 3.3: Build Formation CRUD API

As an **admin**,
I want **API endpoints to manage Formations**,
So that **I can create, read, update, delete adult trainings**.

**Acceptance Criteria:**

**Given** database schema exists
**When** Formation API is created
**Then** CRUD operations work for Formations (FR2)
**And** dates can be attached for Agenda auto-generation (FR14)
**And** `isFull` flag can be set manually (FR13)
**And** all mutations are logged (FR38)
```

### Integration with Previous Stories

**Available from Story 3.1:**

Formation model with relations:
```prisma
model Formation {
  id          String          @id @default(cuid())
  titre       String
  description String
  isFull      Boolean         @default(false)
  published   Boolean         @default(false)
  categorieId String
  categorie   Category        @relation(...)
  tags        Tag[]           @relation("FormationTags")
  images      Image[]         @relation("FormationImages")
  dates       FormationDate[] // Dates for agenda auto-generation
  createdById String?
  createdBy   Admin?          @relation("FormationCreatedBy", ...)
  updatedById String?
  updatedBy   Admin?          @relation("FormationUpdatedBy", ...)
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt
}

model FormationDate {
  id          String    @id @default(cuid())
  formationId String
  formation   Formation @relation(...)
  startDate   DateTime
  endDate     DateTime
  location    String    // "Online" or physical address
  createdAt   DateTime  @default(now())
}
```

**Available from Story 3.2:**

Animation API patterns (reusable for Formation):
- Zod validation schemas structure
- Admin/public endpoint separation
- Authentication with `getAdminFromRequest()`
- Audit logging pattern
- Error handling (Zod, Prisma, generic)
- Soft-delete pattern
- Pagination and filtering
- Many-to-many relations handling (tags, images)

### Key Differences from Animation API

1. **No niveau field** - Formation doesn't have school levels
2. **isFull flag** (FR13) - Boolean to manually mark trainings as full
3. **FormationDate relation** (FR14) - One-to-many with dates for agenda
4. **Date handling** - Need to validate DateTime fields in FormationDate

### File Organization

**Location:** `src/app/api/` (App Router API routes)

**File Structure:**
```
src/
├── app/
│   └── api/
│       ├── admin/
│       │   └── formations/
│       │       ├── route.ts          # NEW: GET (list), POST (create)
│       │       └── [id]/
│       │           └── route.ts      # NEW: GET, PUT, DELETE
│       └── formations/
│           ├── route.ts              # NEW: GET (public list)
│           └── [id]/
│               └── route.ts          # NEW: GET (public detail)
│
└── lib/
    ├── validations/
    │   ├── animation.ts              # EXISTS: Reference pattern
    │   └── formation.ts              # NEW: Zod schemas
    └── constants.ts                  # EXISTS: Add FORMATION_* audit actions
```

### Validation Schemas

**File: src/lib/validations/formation.ts**

```typescript
import { z } from 'zod'

/**
 * Schema for creating a formation
 * FR2: CRUD operations on formations
 * FR13: isFull flag
 * FR14: dates for agenda
 */
export const formationCreateSchema = z.object({
  titre: z.string()
    .min(3, 'Le titre doit contenir au moins 3 caractères')
    .max(100, 'Le titre ne peut pas dépasser 100 caractères'),
  description: z.string()
    .min(10, 'La description doit contenir au moins 10 caractères'),
  categorieId: z.string().cuid('ID de catégorie invalide'),
  isFull: z.boolean().default(false),
  published: z.boolean().default(false),
  // Relations (optional arrays of IDs)
  tagIds: z.array(z.string().cuid()).optional().default([]),
  imageIds: z.array(z.string().cuid()).optional().default([]),
  dateIds: z.array(z.string().cuid()).optional().default([])
})

export type FormationCreateInput = z.infer<typeof formationCreateSchema>

/**
 * Schema for updating a formation
 * All fields optional for partial updates
 */
export const formationUpdateSchema = z.object({
  titre: z.string().min(3).max(100).optional(),
  description: z.string().min(10).optional(),
  categorieId: z.string().cuid().optional(),
  isFull: z.boolean().optional(),
  published: z.boolean().optional(),
  tagIds: z.array(z.string().cuid()).optional(),
  imageIds: z.array(z.string().cuid()).optional(),
  dateIds: z.array(z.string().cuid()).optional()
})

export type FormationUpdateInput = z.infer<typeof formationUpdateSchema>

/**
 * Schema for querying formations (filters, pagination, sorting)
 * FR22: Filter by category, FR27: Filter by tags
 */
export const formationQuerySchema = z.object({
  // Pagination
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),

  // Filters
  categorieId: z.string().cuid().optional(),
  tagIds: z.string().optional(), // Comma-separated tag IDs
  published: z.coerce.boolean().optional(),
  isFull: z.coerce.boolean().optional(),

  // Sorting
  sortBy: z.enum(['createdAt', 'updatedAt', 'titre']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
})

export type FormationQueryInput = z.infer<typeof formationQuerySchema>
```

### Audit Actions

**Add to src/lib/constants.ts:**

```typescript
export const AUDIT_ACTIONS = {
  // ... existing actions
  FORMATION_CREATED: 'formation.created',
  FORMATION_UPDATED: 'formation.updated',
  FORMATION_DELETED: 'formation.deleted',
} as const
```

### API Implementation Patterns

Follow the same patterns as Story 3.2 (Animation API):

1. **Admin endpoints** - Full CRUD with authentication via `getAdminFromRequest()`
2. **Public endpoints** - Read-only, published content only
3. **Validation** - Zod schemas for all inputs
4. **Error handling** - Consistent error response format
5. **Audit logging** - Log all mutations (create, update, delete)
6. **Relations** - Use `connect` for tags, images, dates
7. **Soft delete** - Set `published: false` instead of hard delete

### What NOT to Do

**From Story Scope:**
- ❌ Do NOT create FormationDate CRUD endpoints (not in scope, dates managed via Formation API)
- ❌ Do NOT create formation admin UI pages (Story 3.7)
- ❌ Do NOT implement image upload endpoint (Story 3.6)
- ❌ Do NOT create category/tag management APIs (Story 3.5)
- ❌ Do NOT implement public list page UI (Story 5.2)
- ❌ Do NOT add real-time features or WebSockets

**API Design:**
- ❌ Do NOT skip pagination (always paginate lists)
- ❌ Do NOT expose admin-only fields in public API
- ❌ Do NOT skip audit logging for mutations
- ❌ Do NOT skip validation (always use Zod)
- ❌ Do NOT hard-delete formations (soft-delete only)

**Security:**
- ❌ Do NOT skip authentication checks
- ❌ Do NOT log request bodies (may contain sensitive data)
- ❌ Do NOT expose detailed error messages to public API
- ❌ Do NOT allow SQL injection (use Prisma parameterized queries)

---

## Previous Story Intelligence

### Key Learnings from Story 3.2

1. **Type Handling:** Avoid strict Prisma type annotations when doing custom relation transformations - use `any` for flexibility
2. **Zod Enum:** Use simple string format for error messages: `z.enum(values, 'error message')`
3. **Next.js 16 Async Params:** Extract params at function top before try block
4. **Relation Handling:** Use `connect` for many-to-many, `set` for replacing all relations
5. **Public API Security:** Use explicit `select` to exclude admin-only fields

### Key Learnings from Story 3.1

1. **Schema Structure:** Formation model has dates relation (one-to-many)
2. **Audit Tracking:** createdBy/updatedBy fields track which admin modified content
3. **Indexes:** Schema optimized for queries on published, categorieId, createdAt
4. **Soft Delete Pattern:** Use `published: false` instead of hard delete

---

## File List

**To Create:**
- src/lib/validations/formation.ts - Zod schemas (create, update, query)
- src/app/api/admin/formations/route.ts - Admin list + create endpoints
- src/app/api/admin/formations/[id]/route.ts - Admin detail + update + delete endpoints
- src/app/api/formations/route.ts - Public list endpoint
- src/app/api/formations/[id]/route.ts - Public detail endpoint

**To Modify:**
- src/lib/constants.ts - Add FORMATION_* audit actions

---

## Change Log

| Date | Change | Reason |
|------|--------|--------|
| 2026-01-30 | Story created with comprehensive context | Third story in Epic 3 after 3.2 completion |

---

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

**Session:** 2026-01-30 (continued from Story 3.2 completion)
**Transcript:** /root/.claude/projects/-root-development-cie-website/127fca28-4116-4fa1-92e3-ba9cc9b363d7.jsonl

**Key Debug Points:**
1. Created story document for Story 3.3
2. Implemented all 5 Formation API files following Story 3.2 patterns
3. Fixed field naming error (startDate → dateDebut, endDate → dateFin, location → lieu)
4. Final build: ✓ Successful

### Completion Notes List

**Implementation completed successfully on 2026-01-30**

**Files Created:**
1. `src/lib/validations/formation.ts` - Zod validation schemas for Formation API
   - formationCreateSchema with isFull flag
   - formationUpdateSchema for partial updates
   - formationQuerySchema with pagination and filtering

2. `src/app/api/admin/formations/route.ts` - Admin list and create endpoints
   - GET: List with pagination, filters (categorieId, tagIds, published, isFull)
   - POST: Create with relations (tags, images, dates), audit logging

3. `src/app/api/admin/formations/[id]/route.ts` - Admin detail, update, delete
   - GET: Single formation with all relations including createdBy/updatedBy
   - PUT: Partial update with audit logging
   - DELETE: Soft-delete (published=false) with audit logging

4. `src/app/api/formations/route.ts` - Public list endpoint (published only)
   - Same filters as admin, includes dates for FR14
   - Excludes admin-only fields

5. `src/app/api/formations/[id]/route.ts` - Public detail endpoint (published only)
   - Security-filtered response with dates

**Files Modified:**
- None (FORMATION_* audit actions already existed in src/lib/constants.ts)

**Technical Decisions:**
1. **Reused Patterns from Story 3.2:** Applied all learnings from Animation API implementation
2. **French Field Names:** Used schema field names: `dateDebut`, `dateFin`, `lieu` (not English equivalents)
3. **isFull Flag:** Added boolean field for manual capacity management (FR13)
4. **FormationDate Relation:** Included dates in responses for agenda auto-generation (FR14)
5. **Same Type Handling:** Used `any` type for update data to allow custom relation transformations

**Issues Fixed During Implementation:**
1. Field naming mismatch: Initially used `startDate`, `endDate`, `location`
   - Solution: Updated to use French field names from schema: `dateDebut`, `dateFin`, `lieu`

**Build Status:** ✓ Successful compilation
**All Acceptance Criteria:** ✓ Met
**All Tasks:** ✓ Completed
