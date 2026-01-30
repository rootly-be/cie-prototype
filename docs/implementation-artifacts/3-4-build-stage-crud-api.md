# Story 3.4: Build Stage CRUD API

Status: done

## Story

As an **admin**,
I want **API endpoints to manage Stages**,
So that **I can create, read, update, delete holiday camps**.

## Acceptance Criteria

1. **AC1:** Admin list endpoint
   - **Given** database schema exists (Story 3.1)
   - **When** Stage API is created
   - **Then** `GET /api/admin/stages` returns paginated list (FR3)

2. **AC2:** Admin create endpoint
   - **And** `POST /api/admin/stages` creates with Zod validation
   - **And** validation enforces required fields including age range (FR24)
   - **And** periode/season can be set (FR25)
   - **And** creation logs to AuditLog (FR38)

3. **AC3:** Admin update/delete endpoints
   - **And** `PUT /api/admin/stages/[id]` updates
   - **And** `DELETE /api/admin/stages/[id]` soft-deletes (sets published=false)
   - **And** `isFull` flag can be set manually (FR13)
   - **And** all mutations are logged to AuditLog (FR38)

4. **AC4:** Public endpoints
   - **And** `GET /api/stages` returns published stages only
   - **And** filters work for periode, age range, category, tags (FR24, FR25, FR22, FR27)

## Tasks / Subtasks

- [x] Task 1: Create validation schemas (AC: 2, 4)
  - [x] Create `src/lib/validations/stage.ts`
  - [x] Define `stageCreateSchema` (all required fields including ageMin, ageMax, periode)
  - [x] Define `stageUpdateSchema` (all fields optional)
  - [x] Define `stageQuerySchema` (pagination, filters for periode, age range, category, tags)
  - [x] Export TypeScript types and periode enum

- [x] Task 2: Create admin list endpoint (AC: 1)
  - [x] Create `src/app/api/admin/stages/route.ts`
  - [x] Implement GET handler with pagination
  - [x] Add filters (periode, ageMin/ageMax, categorieId, tagIds, published, isFull)
  - [x] Include relations (categorie, tags, images)
  - [x] Return data + meta

- [x] Task 3: Create admin create endpoint (AC: 2)
  - [x] Implement POST handler
  - [x] Validate request body with stageCreateSchema
  - [x] Extract admin context from middleware
  - [x] Create stage with relations
  - [x] Create audit log entry (STAGE_CREATED)
  - [x] Return created stage with 201

- [x] Task 4: Create admin detail/update/delete endpoints (AC: 3)
  - [x] Create `src/app/api/admin/stages/[id]/route.ts`
  - [x] Implement GET handler
  - [x] Implement PUT handler with audit logging
  - [x] Implement DELETE handler (soft-delete)
  - [x] Handle 404 errors

- [x] Task 5: Create public endpoints (AC: 4)
  - [x] Create `src/app/api/stages/route.ts` (published only)
  - [x] Create `src/app/api/stages/[id]/route.ts` (published only)
  - [x] Add filters for periode and age range
  - [x] Exclude admin-only fields

- [x] Task 6: Error handling (AC: 1, 2, 3, 4)
  - [x] Handle Zod validation errors (400)
  - [x] Handle Prisma errors (404, 400)
  - [x] Handle generic server errors (500)
  - [x] Sanitized logging

- [x] Task 7: Integration testing (AC: 1, 2, 3, 4)
  - [x] Test POST creates stage with age range
  - [x] Test GET list with periode filter
  - [x] Test PUT updates stage
  - [x] Test DELETE soft-deletes
  - [x] Test audit logs
  - [x] Run `npm run build` successfully

## Dev Notes

### CRITICAL: Source Files

**Epic Source (docs/planning-artifacts/epics.md):**
```
Story 3.4: Build Stage CRUD API

As an **admin**,
I want **API endpoints to manage Stages**,
So that **I can create, read, update, delete holiday camps**.

**Acceptance Criteria:**

**Given** database schema exists
**When** Stage API is created
**Then** CRUD operations work for Stages (FR3)
**And** period/season can be set (FR25)
**And** age group can be set (FR24)
**And** `isFull` flag can be set manually (FR13)
**And** all mutations are logged (FR38)
```

### Integration with Previous Stories

**Available from Story 3.1:**

Stage model with all fields:
```prisma
model Stage {
  id           String   @id @default(cuid())
  titre        String
  description  String
  ageMin       Int      // FR24: Age group filtering
  ageMax       Int      // FR24: Age group filtering
  periode      String   // FR25: Pâques, Été, Toussaint, Carnaval
  dateDebut    DateTime
  dateFin      DateTime
  prix         String
  billetwebUrl String?
  billetwebId  String?
  placesTotal  Int?
  placesLeft   Int?
  isFull       Boolean  @default(false) // FR13
  published    Boolean  @default(false)
  categorieId  String?
  categorie    Category?
  tags         Tag[]    @relation("StageTags")
  images       Image[]  @relation("StageImages")
  createdById  String?
  createdBy    Admin?   @relation("StageCreatedBy")
  updatedById  String?
  updatedBy    Admin?   @relation("StageUpdatedBy")
  createdAt    DateTime
  updatedAt    DateTime
}
```

**Available from Stories 3.2 & 3.3:**

Reusable API patterns:
- Zod validation structure
- Admin/public endpoint separation
- Authentication with middleware
- Audit logging
- Error handling
- Soft-delete pattern
- Pagination and filtering
- Many-to-many relations

### Key Differences from Previous APIs

1. **Age Range** (FR24): `ageMin` and `ageMax` integer fields for filtering
2. **Periode Enum** (FR25): Season string ("Pâques", "Été", "Toussaint", "Carnaval")
3. **Pricing**: `prix` string field (format: "50€" or "45€/jour")
4. **Billetweb Integration**: Optional `billetwebUrl` and `billetwebId` fields
5. **Capacity**: Optional `placesTotal` and `placesLeft` fields
6. **Date Fields**: `dateDebut` and `dateFin` DateTime (not a separate relation like Formation)

### Validation Schemas

**File: src/lib/validations/stage.ts**

```typescript
import { z } from 'zod'

// Periode enum for stages
const PERIODES = ['Pâques', 'Été', 'Toussaint', 'Carnaval'] as const

export const stageCreateSchema = z.object({
  titre: z.string().min(3).max(100),
  description: z.string().min(10),
  ageMin: z.number().int().min(0).max(18),
  ageMax: z.number().int().min(0).max(18),
  periode: z.enum(PERIODES, 'Période invalide'),
  dateDebut: z.coerce.date(),
  dateFin: z.coerce.date(),
  prix: z.string().min(1),
  billetwebUrl: z.string().url().optional(),
  billetwebId: z.string().optional(),
  placesTotal: z.number().int().positive().optional(),
  placesLeft: z.number().int().min(0).optional(),
  isFull: z.boolean().default(false),
  published: z.boolean().default(false),
  categorieId: z.string().cuid().optional(),
  tagIds: z.array(z.string().cuid()).optional().default([]),
  imageIds: z.array(z.string().cuid()).optional().default([])
}).refine(data => data.ageMax >= data.ageMin, {
  message: 'ageMax doit être supérieur ou égal à ageMin',
  path: ['ageMax']
}).refine(data => data.dateFin >= data.dateDebut, {
  message: 'dateFin doit être postérieure à dateDebut',
  path: ['dateFin']
})

export const stageUpdateSchema = z.object({
  titre: z.string().min(3).max(100).optional(),
  description: z.string().min(10).optional(),
  ageMin: z.number().int().min(0).max(18).optional(),
  ageMax: z.number().int().min(0).max(18).optional(),
  periode: z.enum(PERIODES).optional(),
  dateDebut: z.coerce.date().optional(),
  dateFin: z.coerce.date().optional(),
  prix: z.string().min(1).optional(),
  billetwebUrl: z.string().url().optional(),
  billetwebId: z.string().optional(),
  placesTotal: z.number().int().positive().optional(),
  placesLeft: z.number().int().min(0).optional(),
  isFull: z.boolean().optional(),
  published: z.boolean().optional(),
  categorieId: z.string().cuid().optional(),
  tagIds: z.array(z.string().cuid()).optional(),
  imageIds: z.array(z.string().cuid()).optional()
})

export const stageQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
  periode: z.enum(PERIODES).optional(),
  ageMin: z.coerce.number().int().min(0).max(18).optional(),
  ageMax: z.coerce.number().int().min(0).max(18).optional(),
  categorieId: z.string().cuid().optional(),
  tagIds: z.string().optional(),
  published: z.coerce.boolean().optional(),
  isFull: z.coerce.boolean().optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'titre', 'dateDebut']).default('dateDebut'),
  sortOrder: z.enum(['asc', 'desc']).default('asc')
})

export { PERIODES }
```

### What NOT to Do

- ❌ Do NOT implement Billetweb sync (Story 7.1)
- ❌ Do NOT create stage admin UI pages (Story 3.7)
- ❌ Do NOT implement image upload (Story 3.6)
- ❌ Do NOT create category/tag management (Story 3.5)
- ❌ Do NOT implement public list page UI (Story 5.3)
- ❌ Do NOT skip validation or audit logging

---

## Previous Story Intelligence

### Key Learnings from Story 3.3

1. **Field Names**: Check schema for exact field names (French vs English)
2. **Type Flexibility**: Use `any` for update data when transforming relations
3. **Reuse Patterns**: Copy structure from Animation/Formation APIs

### Key Learnings from Story 3.2

1. **Zod Enum**: Use simple string format for error messages
2. **Next.js 16**: Extract params at function top before try block
3. **Relations**: Use `connect` for many-to-many, `set` for replacing
4. **Public API**: Use explicit `select` to exclude admin-only fields

---

## File List

**To Create:**
- src/lib/validations/stage.ts
- src/app/api/admin/stages/route.ts
- src/app/api/admin/stages/[id]/route.ts
- src/app/api/stages/route.ts
- src/app/api/stages/[id]/route.ts

**To Modify:**
- None (STAGE_* audit actions already exist)

---

## Change Log

| Date | Change | Reason |
|------|--------|--------|
| 2026-01-30 | Story created | Fourth story in Epic 3 after 3.3 completion |

---

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

**Session:** 2026-01-30 (continued from Story 3.3 completion)
**Transcript:** /root/.claude/projects/-root-development-cie-website/127fca28-4116-4fa1-92e3-ba9cc9b363d7.jsonl

**Key Debug Points:**
1. Created story document for Story 3.4
2. Implemented all 5 Stage API files with age range and periode filtering
3. Added Zod refinements for age and date validation
4. No errors during implementation
5. Final build: ✓ Successful

### Completion Notes List

**Implementation completed successfully on 2026-01-30**

**Files Created:**
1. `src/lib/validations/stage.ts` - Zod validation schemas for Stage API
   - stageCreateSchema with age range validation and periode enum
   - Custom refinements for ageMax >= ageMin and dateFin >= dateDebut
   - stageUpdateSchema for partial updates
   - stageQuerySchema with age range overlap filtering

2. `src/app/api/admin/stages/route.ts` - Admin list and create endpoints
   - GET: List with pagination, filters (periode, age range, category, tags, isFull)
   - Age range filtering with overlap logic (ageMax >= query.ageMin && ageMin <= query.ageMax)
   - POST: Create with all Stage fields, audit logging

3. `src/app/api/admin/stages/[id]/route.ts` - Admin detail, update, delete
   - GET: Single stage with all relations
   - PUT: Partial update with audit logging
   - DELETE: Soft-delete with audit logging

4. `src/app/api/stages/route.ts` - Public list endpoint (published only)
   - Same age range and periode filters
   - Excludes billetwebId from response

5. `src/app/api/stages/[id]/route.ts` - Public detail endpoint (published only)
   - Full stage details excluding admin-only fields

**Technical Decisions:**
1. **Age Range Overlap Filtering (FR24):** Used overlap logic where stage.ageMax >= query.ageMin && stage.ageMin <= query.ageMax to find stages that match requested age ranges
2. **Periode Enum (FR25):** Defined PERIODES as ['Pâques', 'Été', 'Toussaint', 'Carnaval'] for season filtering
3. **Zod Refinements:** Added custom validation to ensure ageMax >= ageMin and dateFin >= dateDebut
4. **Billetweb Fields:** Included billetwebUrl (public), excluded billetwebId (internal) from public API
5. **Default Sorting:** Used dateDebut ascending as default sort (chronological upcoming stages)

**Build Status:** ✓ Successful compilation
**All Acceptance Criteria:** ✓ Met
**All Tasks:** ✓ Completed
