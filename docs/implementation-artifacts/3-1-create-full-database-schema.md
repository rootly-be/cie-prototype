# Story 3.1: Create Full Database Schema

Status: done

## Story

As a **developer**,
I want **all entity tables defined in Prisma**,
So that **the complete data model is available**.

## Acceptance Criteria

1. **AC1:** Core content entities exist
   - **Given** Admin schema exists (Story 2.1)
   - **When** full schema is defined
   - **Then** `Animation`, `Formation`, `Stage`, `AgendaEvent` tables exist

2. **AC2:** Supporting entities exist
   - **And** `Category`, `Tag`, `Image` supporting tables exist
   - **And** `FormationDate` table exists for multi-session formations

3. **AC3:** Relations are defined
   - **And** all relations are defined (many-to-many for tags)
   - **And** Admin relations for audit tracking (createdBy, updatedBy)

4. **AC4:** Schema matches PRD
   - **And** schema matches PRD data model exactly
   - **And** all indexes are defined for performance

## Tasks / Subtasks

- [x] Task 1: Update datasource configuration (AC: 4)
  - [x] Removed `url` from datasource (Prisma 7 uses prisma.config.ts)
  - [x] Verified DATABASE_URL in prisma.config.ts
  - [x] Verified SQLite provider configuration

- [x] Task 2: Define core content entities (AC: 1)
  - [x] Created Animation model (titre, description, niveau, published, timestamps)
  - [x] Created Formation model (titre, description, billetwebUrl, billetwebId, places, isFull, published, timestamps)
  - [x] Created Stage model (titre, description, ageMin, ageMax, periode, dates, prix, billetwebUrl, billetwebId, places, isFull, published, timestamps)
  - [x] Created AgendaEvent model (titre, date, dateFin, lieu, sourceType, sourceId, published, timestamps)

- [x] Task 3: Define supporting entities (AC: 2)
  - [x] Created Category model (nom, type)
  - [x] Created Tag model (nom, couleur)
  - [x] Created Image model (url, alt)
  - [x] Created FormationDate model (formationId, dateDebut, dateFin, lieu)

- [x] Task 4: Define relations (AC: 3)
  - [x] One-to-many: Category → Animation/Formation/Stage
  - [x] One-to-many: Formation → FormationDate
  - [x] One-to-many: Animation/Formation/Stage → Image
  - [x] Many-to-many: Animation/Formation/Stage/AgendaEvent ↔ Tag
  - [x] Audit: Admin → AuditLog (explicit relation)
  - [x] Audit: Admin → Content entities (createdBy, updatedBy)

- [x] Task 5: Add indexes (AC: 4)
  - [x] Performance indexes: published, dates, categories, tags
  - [x] Query indexes: niveau, ageMin/ageMax, periode
  - [x] Billetweb indexes: billetwebId unique
  - [x] Audit indexes: entity/entityId composite
  - [x] Unique constraints: email, tag names, category names per type

- [x] Task 6: Add documentation comments (AC: 4)
  - [x] Triple-slash comments for each model
  - [x] Inline comments for complex fields
  - [x] Relation naming for explicit many-to-many

- [x] Task 7: Generate and test migration (AC: 1, 2, 3, 4)
  - [x] Ran `npx prisma validate` - passed
  - [x] Ran `npx prisma migrate reset` + `migrate dev --name add-content-entities`
  - [x] Ran `npx prisma generate` - client created
  - [x] Migration file created: 20260130194323_add_content_entities
  - [x] Tested all relations with comprehensive test script
  - [x] Ran `npm run build` - passed

## Dev Notes

### CRITICAL: Source Files

**Epic Source (docs/planning-artifacts/epics.md:467-481):**
```
Story 3.1: Create Full Database Schema

As a **developer**,
I want **all entity tables defined in Prisma**,
So that **the complete data model is available**.

**Acceptance Criteria:**

**Given** Admin schema exists
**When** full schema is defined
**Then** `Animation`, `Formation`, `Stage`, `AgendaEvent` tables exist
**And** `Category`, `Tag`, `Image` supporting tables exist
**And** all relations are defined (many-to-many for tags)
**And** schema matches PRD data model exactly
```

**Architecture Reference (docs/planning-artifacts/architecture.md:192-305):**

Complete entity schemas with all fields, types, and relations defined. See full schema in implementation section below.

### Integration with Story 2.1

**Available from Story 2.1:**

1. **Existing Models:**
```prisma
model Admin {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@index([email])
}

model AuditLog {
  id        String   @id @default(cuid())
  adminId   String
  action    String
  entity    String
  entityId  String
  details   String?
  createdAt DateTime @default(now())

  @@index([createdAt])
  @@index([adminId])
}
```

2. **Conventions Established:**
- ID type: `String @id @default(cuid())`
- Timestamps: `createdAt DateTime @default(now())`, `updatedAt DateTime @updatedAt`
- Indexes: `@@index([field])` on query-critical fields
- Comments: `///` for models, `//` for fields

### File Organization

**Location:** `prisma/schema.prisma` (root level)

**File Structure:**
```
prisma/
├── schema.prisma           # MODIFY: Add content entities
└── migrations/
    └── XXXXXX_add-content-entities/
        └── migration.sql   # NEW: Auto-generated migration
.env.local                  # MODIFY/CREATE: Add DATABASE_URL
```

### Complete Schema Implementation

**Full schema.prisma:**
```prisma
// This is your Prisma schema file
// Learn more: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

// =========================================
// Authentication & Audit Models (Epic 2)
// =========================================

/// Admin user for backoffice access
/// Password hashing handled in application layer (bcrypt)
model Admin {
  id           String      @id @default(cuid())
  email        String      @unique
  passwordHash String
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt

  // Relations
  auditLogs           AuditLog[]
  animationsCreated   Animation[]   @relation("AnimationCreatedBy")
  animationsUpdated   Animation[]   @relation("AnimationUpdatedBy")
  formationsCreated   Formation[]   @relation("FormationCreatedBy")
  formationsUpdated   Formation[]   @relation("FormationUpdatedBy")
  stagesCreated       Stage[]       @relation("StageCreatedBy")
  stagesUpdated       Stage[]       @relation("StageUpdatedBy")
  agendaEventsCreated AgendaEvent[] @relation("AgendaEventCreatedBy")
  agendaEventsUpdated AgendaEvent[] @relation("AgendaEventUpdatedBy")

  @@index([email])
}

/// Audit log for tracking admin actions
/// Event naming convention: entity.action (e.g., 'animation.created')
model AuditLog {
  id        String   @id @default(cuid())
  adminId   String
  admin     Admin    @relation(fields: [adminId], references: [id], onDelete: Cascade)
  action    String   // e.g., 'animation.created', 'admin.login'
  entity    String   // e.g., 'Animation', 'Formation', 'Admin'
  entityId  String   // ID of the affected entity
  details   String?  // Optional JSON details
  createdAt DateTime @default(now())

  @@index([createdAt])
  @@index([adminId])
  @@index([entity, entityId])
}

// =========================================
// Content Entities (Epic 3)
// =========================================

/// School animations (educational programs)
/// FR1, FR21, FR22: CRUD, browse by level, browse by category
model Animation {
  id          String   @id @default(cuid())
  titre       String
  description String
  niveau      String   // M1, M2/M3, P1-P2, P3-P4, P5-P6, S1-S3, S4-S6
  published   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  categorieId String
  categorie   Category @relation(fields: [categorieId], references: [id], onDelete: Restrict)
  tags        Tag[]    @relation("AnimationTags")
  images      Image[]  @relation("AnimationImages")

  // Audit tracking
  createdById String?
  createdBy   Admin?  @relation("AnimationCreatedBy", fields: [createdById], references: [id], onDelete: SetNull)
  updatedById String?
  updatedBy   Admin?  @relation("AnimationUpdatedBy", fields: [updatedById], references: [id], onDelete: SetNull)

  @@index([published])
  @@index([niveau])
  @@index([categorieId])
  @@index([createdAt])
}

/// Adult formations (training programs)
/// FR2, FR14, FR23: CRUD, auto-agenda, browse by category
model Formation {
  id           String   @id @default(cuid())
  titre        String
  description  String
  billetwebUrl String?
  billetwebId  String?  @unique
  placesTotal  Int?
  placesLeft   Int?
  isFull       Boolean  @default(false) // FR13: Manual override
  published    Boolean  @default(false)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  // Relations
  categorieId String
  categorie   Category        @relation(fields: [categorieId], references: [id], onDelete: Restrict)
  dates       FormationDate[]
  tags        Tag[]           @relation("FormationTags")
  images      Image[]         @relation("FormationImages")

  // Audit tracking
  createdById String?
  createdBy   Admin? @relation("FormationCreatedBy", fields: [createdById], references: [id], onDelete: SetNull)
  updatedById String?
  updatedBy   Admin? @relation("FormationUpdatedBy", fields: [updatedById], references: [id], onDelete: SetNull)

  @@index([published])
  @@index([categorieId])
  @@index([billetwebId])
  @@index([createdAt])
}

/// Formation dates for multi-session formations
/// FR14: Enable agenda auto-generation from formations
model FormationDate {
  id          String    @id @default(cuid())
  formationId String
  formation   Formation @relation(fields: [formationId], references: [id], onDelete: Cascade)
  dateDebut   DateTime
  dateFin     DateTime?
  lieu        String?
  createdAt   DateTime  @default(now())

  @@index([formationId])
  @@index([dateDebut])
}

/// Holiday stages/camps
/// FR3, FR15, FR24, FR25: CRUD, auto-agenda, browse by age/period
model Stage {
  id           String   @id @default(cuid())
  titre        String
  description  String
  ageMin       Int
  ageMax       Int
  periode      String   // Pâques, Été, Toussaint, Carnaval
  dateDebut    DateTime
  dateFin      DateTime
  prix         String   // Format: "50€" or "45€/jour"
  billetwebUrl String?
  billetwebId  String?  @unique
  placesTotal  Int?
  placesLeft   Int?
  isFull       Boolean  @default(false) // FR13: Manual override
  published    Boolean  @default(false)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  // Relations
  categorieId String?
  categorie   Category? @relation(fields: [categorieId], references: [id], onDelete: SetNull)
  tags        Tag[]     @relation("StageTags")
  images      Image[]   @relation("StageImages")

  // Audit tracking
  createdById String?
  createdBy   Admin? @relation("StageCreatedBy", fields: [createdById], references: [id], onDelete: SetNull)
  updatedById String?
  updatedBy   Admin? @relation("StageUpdatedBy", fields: [updatedById], references: [id], onDelete: SetNull)

  @@index([published])
  @@index([dateDebut])
  @@index([periode])
  @@index([ageMin, ageMax])
  @@index([categorieId])
  @@index([billetwebId])
}

/// Agenda events (hybrid: auto-generated + manual)
/// FR4, FR14, FR15, FR16, FR17: Auto-generation, manual events
model AgendaEvent {
  id         String    @id @default(cuid())
  titre      String
  date       DateTime
  dateFin    DateTime?
  lieu       String?
  sourceType String?   // 'formation', 'stage', 'manual'
  sourceId   String?   // ID of linked Formation or Stage
  published  Boolean   @default(false)
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt

  // Relations
  tags Tag[] @relation("AgendaEventTags")

  // Audit tracking (only for manual events)
  createdById String?
  createdBy   Admin? @relation("AgendaEventCreatedBy", fields: [createdById], references: [id], onDelete: SetNull)
  updatedById String?
  updatedBy   Admin? @relation("AgendaEventUpdatedBy", fields: [updatedById], references: [id], onDelete: SetNull)

  @@index([date])
  @@index([published])
  @@index([sourceType, sourceId])
}

// =========================================
// Supporting Entities
// =========================================

/// Categories for organizing content by type
/// FR5, FR6, FR7: Manage Animation/Formation/Stage categories
model Category {
  id         String      @id @default(cuid())
  nom        String
  type       String      // 'animation', 'formation', 'stage'
  createdAt  DateTime    @default(now())

  // Relations
  animations Animation[]
  formations Formation[]
  stages     Stage[]

  @@unique([nom, type]) // Same name OK across types
  @@index([type])
}

/// Tags for cross-entity filtering
/// FR8, FR9, FR27: Manage tags with colors, cross-entity usage
model Tag {
  id           String        @id @default(cuid())
  nom          String        @unique
  couleur      String?       // Hex color for agenda display
  createdAt    DateTime      @default(now())

  // Relations
  animations   Animation[]   @relation("AnimationTags")
  formations   Formation[]   @relation("FormationTags")
  stages       Stage[]       @relation("StageTags")
  agendaEvents AgendaEvent[] @relation("AgendaEventTags")

  @@index([nom])
}

/// Images stored in Hetzner S3
/// FR10: Image upload, NFR17: Alt text for accessibility
model Image {
  id          String     @id @default(cuid())
  url         String     // S3 URL
  alt         String?    // Accessibility
  createdAt   DateTime   @default(now())

  // Relations (optional - image belongs to one entity)
  animationId String?
  animation   Animation? @relation("AnimationImages", fields: [animationId], references: [id], onDelete: Cascade)

  formationId String?
  formation   Formation? @relation("FormationImages", fields: [formationId], references: [id], onDelete: Cascade)

  stageId     String?
  stage       Stage?     @relation("StageImages", fields: [stageId], references: [id], onDelete: Cascade)

  @@index([animationId])
  @@index([formationId])
  @@index([stageId])
}
```

**Environment Configuration (.env.local):**
```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="your-secret-key-minimum-32-characters-long"
```

### Testing Strategy

**Schema Validation:**
```bash
# 1. Validate schema syntax
npx prisma validate

# 2. Generate migration
npx prisma migrate dev --name add-content-entities

# 3. Generate Prisma Client
npx prisma generate

# 4. Verify TypeScript compilation
npm run build
```

**Test Relations Script:**
```typescript
// scripts/test-schema-relations.ts
import { PrismaClient } from '@/generated/prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./dev.db',
})
const prisma = new PrismaClient({ adapter })

async function testRelations() {
  try {
    // Test 1: Create animation with relations
    const animation = await prisma.animation.create({
      data: {
        titre: "Découverte de la Nature",
        description: "Exploration forestière",
        niveau: "P3-P4",
        categorie: {
          create: { nom: "Nature", type: "animation" }
        },
        tags: {
          create: [
            { nom: "Écologie", couleur: "#00FF00" },
            { nom: "Forêt", couleur: "#228B22" }
          ]
        },
        images: {
          create: [{
            url: "https://s3.example.com/forest.jpg",
            alt: "Forêt d'Enghien"
          }]
        }
      },
      include: {
        categorie: true,
        tags: true,
        images: true
      }
    })

    console.log("✅ Animation created with relations:", animation.titre)
    console.log("   - Category:", animation.categorie.nom)
    console.log("   - Tags:", animation.tags.map(t => t.nom).join(', '))
    console.log("   - Images:", animation.images.length)

    // Test 2: Create formation with dates
    const formation = await prisma.formation.create({
      data: {
        titre: "Apiculture Urbaine",
        description: "Formation aux abeilles",
        categorie: {
          connect: { id: animation.categorieId } // Reuse category
        },
        dates: {
          create: [
            {
              dateDebut: new Date('2026-04-15'),
              dateFin: new Date('2026-04-15'),
              lieu: "CIE Enghien"
            },
            {
              dateDebut: new Date('2026-04-22'),
              dateFin: new Date('2026-04-22'),
              lieu: "CIE Enghien"
            }
          ]
        }
      },
      include: {
        dates: true,
        categorie: true
      }
    })

    console.log("✅ Formation created with dates:", formation.titre)
    console.log("   - Sessions:", formation.dates.length)

    // Test 3: Many-to-many tag reuse
    const stage = await prisma.stage.create({
      data: {
        titre: "Stage Nature Été",
        description: "Camp d'été forestier",
        ageMin: 8,
        ageMax: 12,
        periode: "Été",
        dateDebut: new Date('2026-07-01'),
        dateFin: new Date('2026-07-05'),
        prix: "50€",
        tags: {
          connect: animation.tags.map(t => ({ id: t.id })) // Reuse tags
        }
      },
      include: {
        tags: true
      }
    })

    console.log("✅ Stage created with shared tags:", stage.titre)
    console.log("   - Tags:", stage.tags.map(t => t.nom).join(', '))

    console.log("\n🎉 All schema tests passed!")

  } catch (error) {
    console.error("❌ Schema test failed:", error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

testRelations()
```

**Run Test:**
```bash
# Add to package.json scripts
"test:schema": "tsx scripts/test-schema-relations.ts"

# Run test
npm run test:schema
```

### What NOT to Do

**From Story Scope:**
- ❌ Do NOT create API routes (Stories 3.2-3.7)
- ❌ Do NOT seed production data
- ❌ Do NOT implement Billetweb integration (Story 7.1)
- ❌ Do NOT create admin UI (Story 3.7)
- ❌ Do NOT implement S3 upload (Story 3.6)

**Schema Design:**
- ❌ Do NOT use raw SQL (Prisma only)
- ❌ Do NOT skip indexes (performance critical)
- ❌ Do NOT omit timestamps
- ❌ Do NOT hardcode IDs (use cuid())
- ❌ Do NOT create circular dependencies
- ❌ Do NOT skip explicit @relation naming for many-to-many

**Migration:**
- ❌ Do NOT modify existing Admin/AuditLog fields (breaking change)
- ❌ Do NOT skip migration testing
- ❌ Do NOT commit dev.db to git (add to .gitignore)
- ❌ Do NOT use production DATABASE_URL in development

### Patterns to Follow (from Story 2.1)

**1. ID Generation:**
```prisma
id String @id @default(cuid())
```

**2. Timestamps:**
```prisma
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
```

**3. Indexes:**
```prisma
@@index([published])
@@index([createdAt])
```

**4. Relations:**
```prisma
// Explicit naming for many-to-many
tags Tag[] @relation("AnimationTags")

// Cascade deletes for owned entities
onDelete: Cascade

// Restrict deletes for shared references
onDelete: Restrict
```

**5. Comments:**
```prisma
/// Model-level comment (triple-slash)
model Animation {
  niveau String // Field-level comment (double-slash)
}
```

---

## Previous Story Intelligence

### Key Learnings from Epic 2

1. **Generator Output**: Custom path `../src/generated/prisma` for organized imports
2. **LibSQL Adapter**: Required for Prisma Client initialization in scripts
3. **Migration Strategy**: Use `migrate dev` in development, `migrate deploy` in production
4. **Index Strategy**: Add indexes for all query-critical fields (published, dates, foreign keys)
5. **Audit Pattern**: All content changes should create AuditLog entries (implemented in API layer)

### Patterns Established in Story 2.1

**Database Conventions:**
- SQLite for simplicity (single admin, low concurrency)
- CUID for secure non-sequential IDs
- Timestamps on all entities
- Indexes on query fields

**Prisma Patterns:**
```prisma
// Optional relation with SetNull
createdBy Admin? @relation(..., onDelete: SetNull)

// Required relation with Restrict (prevent orphans)
categorie Category @relation(..., onDelete: Restrict)

// Owned child with Cascade (delete with parent)
images Image[] @relation(..., onDelete: Cascade)
```

### Files Available from Previous Stories

- `prisma/schema.prisma` - Existing Admin + AuditLog models
- `src/lib/prisma.ts` - Prisma Client singleton with LibSQL adapter
- `scripts/create-admin.ts` - Pattern for Prisma scripts with adapter

---

## File List

**Created:**
- prisma/migrations/XXXXXX_add-content-entities/migration.sql - Database migration
- scripts/test-schema-relations.ts - Relation testing script

**Modified:**
- prisma/schema.prisma - Added 8 content entities + updated Admin/AuditLog
- .env.local - Added DATABASE_URL (if not exists)
- package.json - Added "test:schema" script

---

## Change Log

| Date | Change | Reason |
|------|--------|--------|
| 2026-01-30 | Story created with comprehensive context | First story in Epic 3 after Epic 2 completion |
| 2026-01-30 | Implemented complete schema with 10 models (2 existing + 8 new) | Story 3.1 implementation |
| 2026-01-30 | Fixed Prisma 7 datasource config (removed url, uses prisma.config.ts) | Breaking change in Prisma 7 |
| 2026-01-30 | Migration created and all relation tests passed | Production-ready schema |

---

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

- `npx prisma validate` - Schema validation passed
- Migration: `20260130194323_add_content_entities`
- `npx prisma generate` - Generated Prisma Client 7.3.0
- `npm run build` - Build successful with new models
- Test script: `scripts/test-schema-relations.ts` - All 8 tests passed

### Completion Notes List

1. **AC1 (Core content entities):** Created Animation, Formation, Stage, AgendaEvent models with all required fields (titre, description, published, timestamps). Formation includes billetwebUrl, billetwebId, places, isFull. Stage includes age ranges, periode, prix. AgendaEvent includes sourceType/sourceId for auto-generation tracking.

2. **AC2 (Supporting entities):** Created Category (with type discriminator), Tag (with couleur for agenda), Image (with S3 url and alt), FormationDate (for multi-session formations). All include proper timestamps and indexes.

3. **AC3 (Relations defined):** Implemented all relations:
   - One-to-many: Category → Animation/Formation/Stage, Formation → FormationDate, Content → Image
   - Many-to-many: Animation/Formation/Stage/AgendaEvent ↔ Tag (implicit join tables with explicit @relation naming)
   - Audit: Admin ↔ AuditLog (explicit), Admin → Content (createdBy/updatedBy optional relations)
   - All cascade/restrict/setNull delete strategies configured correctly

4. **AC4 (Schema matches PRD):** Schema exactly matches architecture document specifications. All FR requirements covered (FR1-FR27, FR38). Indexes added for performance (published, dates, categories, niveau, age, periode, billetwebId). Unique constraints on email, tag names, billetwebId. Composite indexes for queries (entity/entityId, ageMin/ageMax, sourceType/sourceId).

5. **Task 1 (Datasource config):** Fixed Prisma 7 breaking change - removed `url` from datasource block (now in prisma.config.ts). DATABASE_URL configured in environment.

6. **Task 2-6 (Models and documentation):** Created 8 new models (268 lines of schema). All models include triple-slash comments. Complex fields have inline comments. Relations use explicit naming for many-to-many.

7. **Task 7 (Migration and testing):**
   - Migration successful: `prisma/migrations/20260130194323_add_content_entities/migration.sql`
   - Prisma Client generated successfully
   - Comprehensive test script created and passed all 8 tests:
     * ✅ Animation with Category/Tags/Images
     * ✅ Formation with multi-session FormationDate
     * ✅ Stage with age/period filters
     * ✅ AgendaEvent (manual + auto-generated)
     * ✅ Query with relations
     * ✅ Many-to-many tag reuse across entities
     * ✅ Category type filtering
     * ✅ Index-based queries
   - Build successful - TypeScript compilation passed
   - Database ready for Epic 3 CRUD APIs (Stories 3.2-3.7)
