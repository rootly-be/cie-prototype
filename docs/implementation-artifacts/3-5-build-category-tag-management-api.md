# Story 3.5: Build Category and Tag Management API

Status: done

## Story

As an **admin**,
I want **API endpoints to manage categories and tags**,
So that **I can organize content with metadata**.

## Acceptance Criteria

1. **AC1:** Category CRUD endpoints
   - **Given** database schema exists (Story 3.1)
   - **When** Category API is created
   - **Then** `GET /api/admin/categories` lists all categories
   - **And** `POST /api/admin/categories` creates categories for Animation (FR5), Formation (FR6), Stage (FR7)
   - **And** `PUT /api/admin/categories/[id]` updates categories
   - **And** `DELETE /api/admin/categories/[id]` deletes categories

2. **AC2:** Tag CRUD endpoints
   - **And** `GET /api/admin/tags` lists all tags (FR8, FR9)
   - **And** `POST /api/admin/tags` creates tags with optional color
   - **And** `PUT /api/admin/tags/[id]` updates tags
   - **And** `DELETE /api/admin/tags/[id]` deletes tags

3. **AC3:** Public endpoints
   - **And** `GET /api/categories` returns all categories (public)
   - **And** `GET /api/tags` returns all tags (public)
   - **And** Both endpoints support filtering by type

## Tasks / Subtasks

- [x] Task 1: Create validation schemas (AC: 1, 2)
  - [x] Create `src/lib/validations/category.ts`
  - [x] Define `categoryCreateSchema` (nom, type enum)
  - [x] Define `categoryUpdateSchema` (nom optional)
  - [x] Create `src/lib/validations/tag.ts`
  - [x] Define `tagCreateSchema` (nom, couleur optional)
  - [x] Define `tagUpdateSchema` (nom, couleur optional)

- [x] Task 2: Create Category CRUD endpoints (AC: 1)
  - [x] Create `src/app/api/admin/categories/route.ts` (GET list, POST create)
  - [x] Create `src/app/api/admin/categories/[id]/route.ts` (GET, PUT, DELETE)
  - [x] Add unique constraint validation (nom + type)
  - [x] No audit logging required (simple metadata)

- [x] Task 3: Create Tag CRUD endpoints (AC: 2)
  - [x] Create `src/app/api/admin/tags/route.ts` (GET list, POST create)
  - [x] Create `src/app/api/admin/tags/[id]/route.ts` (GET, PUT, DELETE)
  - [x] Add unique constraint validation (nom)
  - [x] Validate hex color format if provided

- [x] Task 4: Create public endpoints (AC: 3)
  - [x] Create `src/app/api/categories/route.ts` (GET list)
  - [x] Create `src/app/api/tags/route.ts` (GET list)
  - [x] Add type filter for categories

- [x] Task 5: Error handling
  - [x] Handle Zod validation errors (400)
  - [x] Handle Prisma P2002 unique constraint (409)
  - [x] Handle Prisma P2003 foreign key constraint (400)
  - [x] Handle generic server errors (500)

- [x] Task 6: Integration testing
  - [x] Test category unique constraint (nom + type)
  - [x] Test tag unique constraint (nom)
  - [x] Test hex color validation
  - [x] Run `npm run build` successfully

## Dev Notes

### CRITICAL: Source Files

**Epic Source (docs/planning-artifacts/epics.md):**
```
Story 3.5: Build Category and Tag Management API

As an **admin**,
I want **API endpoints to manage categories and tags**,
So that **I can organize content with metadata**.

**Acceptance Criteria:**

**Given** database schema exists
**When** Category/Tag APIs are created
**Then** CRUD for Animation categories (FR5)
**And** CRUD for Formation categories (FR6)
**And** CRUD for Stage categories (FR7)
**And** CRUD for Agenda tags with color (FR8)
**And** cross-entity tag management (FR9)
```

### Integration with Previous Stories

**Available from Story 3.1:**

Category and Tag models:
```prisma
model Category {
  id         String   @id @default(cuid())
  nom        String
  type       String   // 'animation', 'formation', 'stage'
  createdAt  DateTime @default(now())
  animations Animation[]
  formations Formation[]
  stages     Stage[]
  @@unique([nom, type]) // Same name OK across types
}

model Tag {
  id           String   @id @default(cuid())
  nom          String   @unique
  couleur      String?  // Hex color for agenda display
  createdAt    DateTime @default(now())
  animations   Animation[]
  formations   Formation[]
  stages       Stage[]
  agendaEvents AgendaEvent[]
}
```

**Key Differences from Previous APIs:**

1. **No Audit Logging:** Categories and Tags are simple metadata - no audit logs required
2. **No Soft Delete:** Can hard-delete if not in use (Prisma FK constraint prevents deleting in-use items)
3. **No Published Field:** All categories/tags are visible to admins and public
4. **No Pagination:** Simple list endpoints (small datasets)
5. **Unique Constraints:**
   - Category: nom + type (can have "Nature" for animation AND formation)
   - Tag: nom (unique across all content types)

### Validation Schemas

**File: src/lib/validations/category.ts**

```typescript
import { z } from 'zod'

const CATEGORY_TYPES = ['animation', 'formation', 'stage'] as const

export const categoryCreateSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(50),
  type: z.enum(CATEGORY_TYPES, 'Type invalide')
})

export const categoryUpdateSchema = z.object({
  nom: z.string().min(2).max(50).optional()
  // Type cannot be changed after creation
})

export const categoryQuerySchema = z.object({
  type: z.enum(CATEGORY_TYPES).optional()
})

export { CATEGORY_TYPES }
```

**File: src/lib/validations/tag.ts**

```typescript
import { z } from 'zod'

// Hex color validation (optional)
const hexColorRegex = /^#[0-9A-Fa-f]{6}$/

export const tagCreateSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(50),
  couleur: z.string().regex(hexColorRegex, 'Couleur doit être au format hex (#RRGGBB)').optional()
})

export const tagUpdateSchema = z.object({
  nom: z.string().min(2).max(50).optional(),
  couleur: z.string().regex(hexColorRegex).optional()
})
```

### API Implementation Notes

1. **No Admin Context Required:** Categories/Tags don't track who created them
2. **Simple List Responses:** No pagination, just return all items
3. **Delete Validation:** Prisma will prevent deleting categories/tags in use (FK constraint)
4. **Public Endpoints:** Same as admin endpoints but without authentication

### What NOT to Do

- ❌ Do NOT add audit logging (not required for metadata)
- ❌ Do NOT add pagination (small datasets)
- ❌ Do NOT add published/createdBy fields
- ❌ Do NOT allow changing category type after creation
- ❌ Do NOT add soft-delete (use hard delete with FK protection)

---

## Previous Story Intelligence

### Key Learnings from Stories 3.2-3.4

1. **Zod Validation:** Use enum with string message format
2. **Error Handling:** Prisma P2002 = unique constraint violation (409 Conflict)
3. **Type Handling:** Use `any` when transforming data
4. **Field Names:** Check schema for exact names (French vs English)

---

## File List

**To Create:**
- src/lib/validations/category.ts
- src/lib/validations/tag.ts
- src/app/api/admin/categories/route.ts
- src/app/api/admin/categories/[id]/route.ts
- src/app/api/admin/tags/route.ts
- src/app/api/admin/tags/[id]/route.ts
- src/app/api/categories/route.ts
- src/app/api/tags/route.ts

---

## Change Log

| Date | Change | Reason |
|------|--------|--------|
| 2026-01-30 | Story created | Fifth story in Epic 3 after 3.4 completion |

---

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

**Session:** 2026-01-30 (continued from Story 3.4 completion)
**Transcript:** /root/.claude/projects/-root-development-cie-website/127fca28-4116-4fa1-92e3-ba9cc9b363d7.jsonl

**Key Debug Points:**
1. Created story document for Story 3.5
2. Implemented all 8 files (2 validation schemas + 6 endpoints)
3. Simpler implementation - no audit logging, no pagination
4. No errors during implementation
5. Final build: ✓ Successful

### Completion Notes List

**Implementation completed successfully on 2026-01-30**

**Files Created:**
1. `src/lib/validations/category.ts` - Category validation schemas
   - categoryCreateSchema with type enum ('animation', 'formation', 'stage')
   - Unique constraint: nom + type

2. `src/lib/validations/tag.ts` - Tag validation schemas
   - tagCreateSchema with optional hex color validation
   - Unique constraint: nom (global)

3. `src/app/api/admin/categories/route.ts` - Admin category list/create
4. `src/app/api/admin/categories/[id]/route.ts` - Admin category get/update/delete
5. `src/app/api/admin/tags/route.ts` - Admin tag list/create
6. `src/app/api/admin/tags/[id]/route.ts` - Admin tag get/update/delete
7. `src/app/api/categories/route.ts` - Public category list
8. `src/app/api/tags/route.ts` - Public tag list

**Technical Decisions:**
1. **No Audit Logging:** Categories and tags are simple metadata - no audit trail required
2. **No Pagination:** Small datasets, return all items sorted alphabetically
3. **Hard Delete:** Use Prisma FK constraints to prevent deleting items in use (P2003 error)
4. **HTTP 409 Conflict:** Used for unique constraint violations (P2002)
5. **Hex Color Validation:** Regex pattern `/^#[0-9A-Fa-f]{6}$/` for tag colors
6. **Public Endpoints:** Same as admin but without authentication - all metadata is public

**Build Status:** ✓ Successful compilation
**All Acceptance Criteria:** ✓ Met
**All Tasks:** ✓ Completed
