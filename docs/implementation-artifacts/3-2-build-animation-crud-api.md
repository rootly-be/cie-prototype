# Story 3.2: Build Animation CRUD API

Status: done

## Story

As an **admin**,
I want **API endpoints to manage Animations**,
So that **I can create, read, update, delete school programs**.

## Acceptance Criteria

1. **AC1:** Admin list endpoint
   - **Given** database schema exists (Story 3.1)
   - **When** Animation API is created
   - **Then** `GET /api/admin/animations` returns paginated list (FR1)

2. **AC2:** Admin create endpoint
   - **And** `POST /api/admin/animations` creates with Zod validation
   - **And** validation enforces required fields and niveau enum
   - **And** creation logs to AuditLog (FR38)

3. **AC3:** Admin update/delete endpoints
   - **And** `PUT /api/admin/animations/[id]` updates
   - **And** `DELETE /api/admin/animations/[id]` soft-deletes (sets published=false)
   - **And** all mutations are logged to AuditLog (FR38)

4. **AC4:** Public endpoints
   - **And** `GET /api/animations` returns published animations only
   - **And** filters work for niveau, category, tags (FR21, FR22, FR27)

## Tasks / Subtasks

- [x] Task 1: Create validation schemas (AC: 2, 4)
  - [x] Create `src/lib/validations/animation.ts`
  - [x] Define `animationCreateSchema` (titre, description, niveau enum, categorieId, tagIds, imageIds)
  - [x] Define `animationUpdateSchema` (all fields optional)
  - [x] Define `animationQuerySchema` (pagination, filters, sorting)
  - [x] Export TypeScript types for each schema

- [x] Task 2: Create admin list endpoint (AC: 1)
  - [x] Create `src/app/api/admin/animations/route.ts`
  - [x] Implement GET handler with pagination (page, pageSize)
  - [x] Add filters (niveau, categorieId, tagIds, published)
  - [x] Include relations (categorie, tags, images)
  - [x] Return data + meta (total, page, totalPages)

- [x] Task 3: Create admin create endpoint (AC: 2)
  - [x] Implement POST handler in `route.ts`
  - [x] Validate request body with animationCreateSchema
  - [x] Extract admin context from middleware headers
  - [x] Create animation with createdById
  - [x] Connect tags and images relations
  - [x] Create audit log entry (ANIMATION_CREATED)
  - [x] Return created animation with 201 status

- [x] Task 4: Create admin detail/update/delete endpoints (AC: 3)
  - [x] Create `src/app/api/admin/animations/[id]/route.ts`
  - [x] Implement GET handler (single animation with relations)
  - [x] Implement PUT handler (validate, update, audit log)
  - [x] Implement DELETE handler (soft-delete: published=false, audit log)
  - [x] Handle 404 for non-existent animations

- [x] Task 5: Create public endpoints (AC: 4)
  - [x] Create `src/app/api/animations/route.ts` (GET list, published only)
  - [x] Create `src/app/api/animations/[id]/route.ts` (GET detail, published only)
  - [x] Add same filters as admin endpoint
  - [x] Exclude admin-only fields (createdById, updatedById)

- [x] Task 6: Error handling (AC: 1, 2, 3, 4)
  - [x] Handle Zod validation errors (400)
  - [x] Handle Prisma P2025 not found (404)
  - [x] Handle Prisma P2002 unique constraint (400)
  - [x] Handle generic server errors (500)
  - [x] Sanitized logging (no sensitive data)

- [x] Task 7: Integration testing (AC: 1, 2, 3, 4)
  - [x] Test POST creates animation with relations
  - [x] Test GET list with pagination and filters
  - [x] Test PUT updates animation
  - [x] Test DELETE soft-deletes
  - [x] Test audit logs created
  - [x] Test public endpoints only show published
  - [x] Run `npm run build` successfully

## Dev Notes

### CRITICAL: Source Files

**Epic Source (docs/planning-artifacts/epics.md:484-496):**
```
Story 3.2: Build Animation CRUD API

As an **admin**,
I want **API endpoints to manage Animations**,
So that **I can create, read, update, delete school programs**.

**Acceptance Criteria:**

**Given** database schema exists
**When** Animation API is created
**Then** `GET /api/admin/animations` returns paginated list (FR1)
**And** `POST /api/admin/animations` creates with Zod validation
**And** `PUT /api/admin/animations/[id]` updates
**And** `DELETE /api/admin/animations/[id]` soft-deletes
**And** all mutations are logged to AuditLog (FR38)
```

**Architecture Reference (docs/planning-artifacts/architecture.md:346-375):**

API Routes Structure:
```
/api/animations          GET    - List (public)
/api/animations/[id]     GET    - Detail (public)
/api/admin/animations    GET    - List (admin)
/api/admin/animations    POST   - Create (admin)
/api/admin/animations/[id] GET  - Detail (admin)
/api/admin/animations/[id] PUT  - Update (admin)
/api/admin/animations/[id] DELETE - Delete (admin)
```

### Integration with Previous Stories

**Available from Story 3.1:**

Animation model with relations:
```prisma
model Animation {
  id          String   @id @default(cuid())
  titre       String
  description String
  niveau      String   // M1, M2/M3, P1-P2, P3-P4, P5-P6, S1-S3, S4-S6
  published   Boolean  @default(false)
  categorieId String
  categorie   Category @relation(...)
  tags        Tag[]    @relation("AnimationTags")
  images      Image[]  @relation("AnimationImages")
  createdById String?
  createdBy   Admin?   @relation("AnimationCreatedBy", ...)
  updatedById String?
  updatedBy   Admin?   @relation("AnimationUpdatedBy", ...)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

**Available from Story 2.2:**

Login API patterns:
- Zod validation with `safeParse()`
- Error handling (ZodError, PrismaClientKnownRequestError)
- Response format: `{ data: {...} }` or `{ error: { code, message, details } }`
- Audit logging pattern

**Available from Story 2.3:**

Middleware authentication:
- Admin routes protected automatically (`/admin/*`)
- Admin context in headers: `x-admin-id`, `x-admin-email`
- Helper to extract admin context from request

### File Organization

**Location:** `src/app/api/` (App Router API routes)

**File Structure:**
```
src/
├── app/
│   └── api/
│       ├── admin/
│       │   └── animations/
│       │       ├── route.ts          # NEW: GET (list), POST (create)
│       │       └── [id]/
│       │           └── route.ts      # NEW: GET, PUT, DELETE
│       └── animations/
│           ├── route.ts              # NEW: GET (public list)
│           └── [id]/
│               └── route.ts          # NEW: GET (public detail)
│
└── lib/
    ├── validations/
    │   └── animation.ts              # NEW: Zod schemas
    ├── constants.ts                  # EXISTS: Add ANIMATION_* audit actions
    └── auth.ts                       # EXISTS: Add getAdminFromRequest helper
```

### Validation Schemas

**File: src/lib/validations/animation.ts**

```typescript
import { z } from 'zod'

// Niveau enum - school levels
const NIVEAUX = ['M1', 'M2/M3', 'P1-P2', 'P3-P4', 'P5-P6', 'S1-S3', 'S4-S6'] as const

/**
 * Schema for creating an animation
 * FR1: CRUD operations on animations
 */
export const animationCreateSchema = z.object({
  titre: z.string()
    .min(3, 'Le titre doit contenir au moins 3 caractères')
    .max(100, 'Le titre ne peut pas dépasser 100 caractères'),
  description: z.string()
    .min(10, 'La description doit contenir au moins 10 caractères'),
  niveau: z.enum(NIVEAUX, {
    errorMap: () => ({ message: 'Niveau scolaire invalide' })
  }),
  categorieId: z.string().cuid('ID de catégorie invalide'),
  published: z.boolean().default(false),
  // Relations (optional arrays of IDs)
  tagIds: z.array(z.string().cuid()).optional().default([]),
  imageIds: z.array(z.string().cuid()).optional().default([])
})

export type AnimationCreateInput = z.infer<typeof animationCreateSchema>

/**
 * Schema for updating an animation
 * All fields optional for partial updates
 */
export const animationUpdateSchema = z.object({
  titre: z.string().min(3).max(100).optional(),
  description: z.string().min(10).optional(),
  niveau: z.enum(NIVEAUX).optional(),
  categorieId: z.string().cuid().optional(),
  published: z.boolean().optional(),
  tagIds: z.array(z.string().cuid()).optional(),
  imageIds: z.array(z.string().cuid()).optional()
})

export type AnimationUpdateInput = z.infer<typeof animationUpdateSchema>

/**
 * Schema for querying animations (filters, pagination, sorting)
 * FR21: Filter by niveau, FR22: Filter by category, FR27: Filter by tags
 */
export const animationQuerySchema = z.object({
  // Pagination
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),

  // Filters
  niveau: z.enum(NIVEAUX).optional(),
  categorieId: z.string().cuid().optional(),
  tagIds: z.string().optional(), // Comma-separated tag IDs
  published: z.coerce.boolean().optional(),

  // Sorting
  sortBy: z.enum(['createdAt', 'updatedAt', 'titre']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
})

export type AnimationQueryInput = z.infer<typeof animationQuerySchema>
```

### Authentication Helper

**Add to src/lib/auth.ts:**

```typescript
import { NextRequest } from 'next/server'

/**
 * Extract admin context from request headers (set by middleware Story 2.3)
 * @param request - Next.js request
 * @returns Admin context or null if not authenticated
 */
export function getAdminFromRequest(request: NextRequest): { adminId: string; email: string } | null {
  const adminId = request.headers.get('x-admin-id')
  const email = request.headers.get('x-admin-email')

  if (!adminId || !email) {
    return null
  }

  return { adminId, email }
}
```

### Audit Actions

**Add to src/lib/constants.ts:**

```typescript
export const AUDIT_ACTIONS = {
  // ... existing actions
  ANIMATION_CREATED: 'animation.created',
  ANIMATION_UPDATED: 'animation.updated',
  ANIMATION_DELETED: 'animation.deleted',
} as const
```

### API Implementation Patterns

**Admin List Endpoint (GET /api/admin/animations):**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { animationQuerySchema } from '@/lib/validations/animation'
import { ERROR_CODES } from '@/lib/constants'

export async function GET(request: NextRequest) {
  try {
    // Parse and validate query params
    const { searchParams } = new URL(request.url)
    const query = animationQuerySchema.parse(Object.fromEntries(searchParams))

    // Build where clause
    const where: any = {}
    if (query.niveau) where.niveau = query.niveau
    if (query.categorieId) where.categorieId = query.categorieId
    if (query.published !== undefined) where.published = query.published
    if (query.tagIds) {
      where.tags = {
        some: {
          id: { in: query.tagIds.split(',') }
        }
      }
    }

    // Pagination
    const skip = (query.page - 1) * query.pageSize
    const take = query.pageSize

    // Fetch data with count
    const [animations, total] = await Promise.all([
      prisma.animation.findMany({
        where,
        include: {
          categorie: true,
          tags: true,
          images: true
        },
        orderBy: { [query.sortBy]: query.sortOrder },
        skip,
        take
      }),
      prisma.animation.count({ where })
    ])

    return NextResponse.json({
      data: animations,
      meta: {
        total,
        page: query.page,
        pageSize: query.pageSize,
        totalPages: Math.ceil(total / query.pageSize)
      }
    })

  } catch (error) {
    // Error handling (Zod, Prisma, generic)
    // ... (see Story 2.2 pattern)
  }
}
```

**Admin Create Endpoint (POST /api/admin/animations):**

```typescript
export async function POST(request: NextRequest) {
  try {
    // Get admin context from middleware
    const admin = getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json(
        { error: { code: ERROR_CODES.UNAUTHORIZED, message: 'Non authentifié' } },
        { status: 401 }
      )
    }

    // Validate request body
    const body = await request.json()
    const validated = animationCreateSchema.parse(body)

    // Create animation with relations
    const animation = await prisma.animation.create({
      data: {
        titre: validated.titre,
        description: validated.description,
        niveau: validated.niveau,
        published: validated.published,
        categorieId: validated.categorieId,
        createdById: admin.adminId,
        updatedById: admin.adminId,
        tags: {
          connect: validated.tagIds.map(id => ({ id }))
        },
        images: {
          connect: validated.imageIds.map(id => ({ id }))
        }
      },
      include: {
        categorie: true,
        tags: true,
        images: true
      }
    })

    // FR38: Audit logging
    await prisma.auditLog.create({
      data: {
        adminId: admin.adminId,
        action: AUDIT_ACTIONS.ANIMATION_CREATED,
        entity: 'Animation',
        entityId: animation.id,
        details: JSON.stringify({ titre: animation.titre })
      }
    })

    return NextResponse.json({ data: animation }, { status: 201 })

  } catch (error) {
    // Error handling
  }
}
```

### Testing Strategy

**Manual API Testing:**

```bash
# 1. Login to get auth cookie
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@cie.test","password":"testpassword123"}' \
  -c cookies.txt

# 2. Create animation
curl -X POST http://localhost:3000/api/admin/animations \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "titre": "L'\''écosystème de la mare",
    "description": "Découverte de la biodiversité aquatique",
    "niveau": "P3-P4",
    "categorieId": "cat123",
    "published": false,
    "tagIds": ["tag1", "tag2"]
  }'

# 3. List animations (admin)
curl http://localhost:3000/api/admin/animations?page=1&pageSize=10 \
  -b cookies.txt

# 4. Get single animation
curl http://localhost:3000/api/admin/animations/[id] \
  -b cookies.txt

# 5. Update animation
curl -X PUT http://localhost:3000/api/admin/animations/[id] \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"published": true}'

# 6. List public animations (published only)
curl http://localhost:3000/api/animations

# 7. Delete animation (soft-delete)
curl -X DELETE http://localhost:3000/api/admin/animations/[id] \
  -b cookies.txt
```

### What NOT to Do

**From Story Scope:**
- ❌ Do NOT create animation admin UI pages (Story 3.7)
- ❌ Do NOT implement image upload endpoint (Story 3.6)
- ❌ Do NOT create category/tag management APIs (Story 3.5)
- ❌ Do NOT implement public list page UI (Story 5.1)
- ❌ Do NOT add real-time features or WebSockets

**API Design:**
- ❌ Do NOT skip pagination (always paginate lists)
- ❌ Do NOT expose admin-only fields in public API
- ❌ Do NOT skip audit logging for mutations
- ❌ Do NOT skip validation (always use Zod)
- ❌ Do NOT hard-delete animations (soft-delete only)

**Security:**
- ❌ Do NOT skip authentication checks
- ❌ Do NOT log request bodies (may contain sensitive data)
- ❌ Do NOT expose detailed error messages to public API
- ❌ Do NOT allow SQL injection (use Prisma parameterized queries)

### Patterns to Follow (from Story 2.2)

**1. Response Format:**
```typescript
// Success
{ data: {...} }

// Error
{ error: { code: string, message: string, details?: any } }
```

**2. Error Handling:**
```typescript
if (error instanceof z.ZodError) {
  return NextResponse.json(
    { error: { code: 'VALIDATION_ERROR', message: 'Données invalides', details: error.issues } },
    { status: 400 }
  )
}
```

**3. Audit Logging:**
```typescript
await prisma.auditLog.create({
  data: {
    adminId: admin.adminId,
    action: AUDIT_ACTIONS.ANIMATION_CREATED,
    entity: 'Animation',
    entityId: animation.id
  }
})
```

---

## Previous Story Intelligence

### Key Learnings from Story 3.1

1. **Schema Structure:** Animation model has relations with Category (required), Tags (many-to-many), Images (one-to-many)
2. **Audit Tracking:** createdBy/updatedBy fields track which admin modified content
3. **Indexes:** Schema optimized for queries on published, niveau, categorieId, createdAt
4. **Soft Delete Pattern:** Use `published: false` instead of hard delete

### Key Learnings from Story 2.2/2.3

1. **Authentication:** Admin routes protected by middleware, context in headers
2. **Validation:** Zod safeParse() prevents runtime errors
3. **Error Handling:** Consistent error codes and response format
4. **Logging:** Structured logging with sanitized data

---

## File List

**Created:**
- src/lib/validations/animation.ts - Zod schemas (create, update, query)
- src/app/api/admin/animations/route.ts - Admin list + create endpoints
- src/app/api/admin/animations/[id]/route.ts - Admin detail + update + delete endpoints
- src/app/api/animations/route.ts - Public list endpoint
- src/app/api/animations/[id]/route.ts - Public detail endpoint

**Modified:**
- src/lib/constants.ts - Added ANIMATION_* audit actions
- src/lib/auth.ts - Added getAdminFromRequest helper

---

## Change Log

| Date | Change | Reason |
|------|--------|--------|
| 2026-01-30 | Story created with comprehensive context | Second story in Epic 3 after 3.1 completion |

---

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

**Session:** 2026-01-30 (continued from compacted session)
**Transcript:** /root/.claude/projects/-root-development-cie-website/127fca28-4116-4fa1-92e3-ba9cc9b363d7.jsonl

**Key Debug Points:**
1. Initial implementation of all 7 API endpoints
2. Fixed Next.js 16 async params pattern (awaiting context.params)
3. Fixed Prisma type error in PUT handler (line 82 of admin/animations/[id]/route.ts)
4. Fixed Zod enum validation syntax (line 27 of validations/animation.ts)
5. Final build: ✓ Successful

### Completion Notes List

**Implementation completed successfully on 2026-01-30**

**Files Created:**
1. `src/lib/validations/animation.ts` - Zod validation schemas for Animation API
   - animationCreateSchema with niveau enum validation
   - animationUpdateSchema for partial updates
   - animationQuerySchema with pagination and filtering

2. `src/app/api/admin/animations/route.ts` - Admin list and create endpoints
   - GET: List with pagination, filters (niveau, categorieId, tagIds, published)
   - POST: Create with relations (tags, images), audit logging

3. `src/app/api/admin/animations/[id]/route.ts` - Admin detail, update, delete
   - GET: Single animation with all relations including createdBy/updatedBy
   - PUT: Partial update with audit logging
   - DELETE: Soft-delete (published=false) with audit logging

4. `src/app/api/animations/route.ts` - Public list endpoint (published only)
   - Same filters as admin, excludes admin-only fields

5. `src/app/api/animations/[id]/route.ts` - Public detail endpoint (published only)
   - Security-filtered response

**Files Modified:**
- `src/lib/auth.ts` - Added getAdminFromRequest helper (already existed from previous summary)
- `src/lib/constants.ts` - Added ANIMATION_* audit actions (already existed from previous summary)

**Technical Decisions:**
1. **Next.js 16 Async Params:** Fixed by extracting params at function top before try block
2. **Prisma Type Handling:** Removed strict AnimationUpdateInput type annotation to allow custom transformations for relation fields
3. **Zod Enum Error Messages:** Used simple string format instead of errorMap for z.enum()
4. **Soft Delete Pattern:** DELETE sets published=false instead of removing records
5. **Security:** Public API only exposes published content with selective field exclusion

**Issues Fixed During Implementation:**
1. TypeScript error: `updatedById does not exist in type AnimationUpdateInput`
   - Solution: Changed type annotation from `Prisma.AnimationUpdateInput` to `any` for custom transformations

2. Zod validation error: `errorMap does not exist in type`
   - Solution: Changed `z.enum(NIVEAUX, { errorMap: ... })` to `z.enum(NIVEAUX, 'error message')`

**Build Status:** ✓ Successful compilation
**All Acceptance Criteria:** ✓ Met
**All Tasks:** ✓ Completed
