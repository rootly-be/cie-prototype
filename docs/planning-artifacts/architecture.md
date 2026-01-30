---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
status: 'complete'
completedAt: '2026-01-26'
inputDocuments:
  - 'docs/planning-artifacts/prd.md'
  - 'docs/architecture.md'
  - 'docs/component-inventory.md'
workflowType: 'architecture'
project_name: 'cie-website'
user_name: 'Greg'
date: '2026-01-26'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
- 56 FRs across 9 categories
- Core: Content Management (CRUD 4 entities), Agenda auto-generation, Billetweb integration
- UI: 29 components pixel-perfect reproduction from cie4 prototype
- Admin: Simple backoffice with auth, preview, publish workflow

**Non-Functional Requirements:**
- Performance: Lighthouse > 90 all categories, < 3s load
- Security: HTTPS, JWT auth, CSRF protection, input validation
- Accessibility: WCAG 2.1 AA compliance
- Integration: Billetweb (sync < 30s), n8n (webhook < 5s), S3 (upload < 10s)
- Reliability: 99% uptime, daily backups

**Scale & Complexity:**
- Primary domain: Full-stack web application
- Complexity level: Medium
- Estimated architectural components: ~15-20 (API routes, services, UI components)

### Technical Constraints & Dependencies

| Constraint | Impact |
|------------|--------|
| cie4 design pixel-perfect | Fixed design system, no creative deviation |
| Billetweb API dependency | External integration, requires fallback strategy |
| Hetzner S3 (not AWS) | S3-compatible, use AWS SDK with custom endpoint |
| French only (V1) | No i18n infrastructure needed for MVP |
| No payments (V1) | Simplified checkout flow via external links |

### Cross-Cutting Concerns Identified

1. **Authentication & Authorization** - JWT-based, admin-only backoffice
2. **Caching Strategy** - ISR for public pages, API cache for Billetweb data
3. **Design System** - CSS variables from cie4, component library
4. **Error Handling** - Graceful degradation for integrations, user feedback
5. **Audit Logging** - Admin action tracking for accountability

## Starter Template Evaluation

### Primary Technology Domain

Full-stack web application with SSR/SSG requirements, admin backoffice, and external integrations.

### Technical Preferences Confirmed

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| Database | SQLite | Small data volume, simplifies deployment |
| Hosting | Hetzner VPS + Docker | Cost-effective, full control |
| Frontend Framework | Next.js | No team preference, largest ecosystem |

### Starter Options Considered

| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| create-next-app | Official, maintained, flexible | Minimal setup required | ✅ Selected |
| T3 Stack | Full batteries (tRPC, Tailwind) | Over-engineered for this project | ❌ |
| create-t3-turbo | Monorepo ready | Too complex | ❌ |
| Nuxt 3 | Vue ecosystem | No Vue preference | ❌ |

### Selected Starter: create-next-app (Next.js 14+)

**Rationale for Selection:**
- Official Next.js starter, always up-to-date
- App Router for modern patterns (Server Components, streaming)
- API routes integrated (no separate backend needed)
- Prisma + SQLite works seamlessly
- Docker deployment straightforward
- Large community, extensive documentation

**Initialization Command:**

```bash
npx create-next-app@latest cie-website --typescript --eslint --no-tailwind --app --src-dir
```

### Architectural Decisions Provided by Starter

**Language & Runtime:**
- TypeScript with strict mode
- Node.js runtime for API routes
- React 18+ with Server Components

**Styling Solution:**
- CSS Modules supported natively
- Will port cie4 CSS variables and components directly
- No Tailwind (preserving existing design system)

**Build Tooling:**
- Turbopack for development (fast HMR)
- Webpack for production builds
- Automatic code splitting

**Testing Framework:**
- Not included by default
- Will add: Vitest (unit), Playwright (E2E)

**Code Organization:**
- `src/` directory structure
- App Router file-based routing
- Colocation of components and styles

**Development Experience:**
- Fast Refresh (HMR)
- TypeScript integration
- Built-in API routes

### Project Structure

```
cie-website/
├── src/
│   ├── app/                    # App Router (pages + API)
│   │   ├── (public)/           # Pages publiques
│   │   │   ├── page.tsx        # Accueil
│   │   │   ├── animations/
│   │   │   ├── formations/
│   │   │   ├── stages/
│   │   │   ├── agenda/
│   │   │   └── contact/
│   │   ├── admin/              # Backoffice (protégé)
│   │   │   ├── layout.tsx      # Auth wrapper
│   │   │   └── [entity]/
│   │   └── api/                # API routes
│   │       ├── auth/
│   │       ├── animations/
│   │       ├── formations/
│   │       ├── stages/
│   │       ├── agenda/
│   │       └── webhooks/
│   ├── components/             # 29 composants cie4
│   ├── lib/                    # Prisma client, utils
│   └── styles/                 # CSS cie4 (variables, composants)
├── prisma/
│   ├── schema.prisma           # Schéma SQLite
│   └── dev.db                  # Base SQLite
├── public/                     # Assets statiques
├── Dockerfile
└── docker-compose.yml
```

**Note:** Project initialization using this command should be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- Database: Prisma 7.2 + SQLite
- Authentication: JWT simple + bcrypt
- Hosting: Docker standalone sur Hetzner VPS

**Important Decisions (Shape Architecture):**
- Caching: ISR 60s public, 5min Billetweb API cache
- API Pattern: REST via Next.js API Routes
- Component Strategy: Server Components par défaut

**Deferred Decisions (Post-MVP):**
- Multi-admin roles (Phase 2)
- Analytics integration (Phase 2)
- Multi-language support (Phase 3)

### Data Architecture

| Decision | Choice | Version | Rationale |
|----------|--------|---------|-----------|
| ORM | Prisma | 7.2.0 | Rust-free, type-safe, excellent DX |
| Database | SQLite | - | Small data volume, simplified deployment |
| Migrations | Prisma Migrate | - | Integrated with ORM |

**Schema Design (4 Entities + Relations):**

```prisma
model Animation {
  id          String   @id @default(cuid())
  titre       String
  description String
  niveau      String   // M1, M2/M3, P1-P6, S1-S6
  categorie   Category @relation(fields: [categorieId], references: [id])
  categorieId String
  tags        Tag[]
  images      Image[]
  published   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Formation {
  id           String   @id @default(cuid())
  titre        String
  description  String
  categorie    Category @relation(fields: [categorieId], references: [id])
  categorieId  String
  dates        FormationDate[]
  billetwebUrl String?
  billetwebId  String?
  placesTotal  Int?
  placesLeft   Int?
  tags         Tag[]
  images       Image[]
  published    Boolean  @default(false)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Stage {
  id           String   @id @default(cuid())
  titre        String
  description  String
  ageMin       Int
  ageMax       Int
  periode      String   // Pâques, Été, Toussaint, etc.
  dateDebut    DateTime
  dateFin      DateTime
  prix         Decimal
  billetwebUrl String?
  billetwebId  String?
  placesTotal  Int?
  placesLeft   Int?
  tags         Tag[]
  images       Image[]
  published    Boolean  @default(false)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model AgendaEvent {
  id         String    @id @default(cuid())
  titre      String
  date       DateTime
  dateFin    DateTime?
  lieu       String?
  sourceType String?   // 'formation', 'stage', 'manual'
  sourceId   String?
  tags       Tag[]
  published  Boolean   @default(false)
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt
}

model Category {
  id         String      @id @default(cuid())
  nom        String
  type       String      // 'animation', 'formation', 'stage'
  animations Animation[]
  formations Formation[]
}

model Tag {
  id          String        @id @default(cuid())
  nom         String        @unique
  couleur     String?
  animations  Animation[]
  formations  Formation[]
  stages      Stage[]
  agendaEvents AgendaEvent[]
}

model Image {
  id          String     @id @default(cuid())
  url         String
  alt         String?
  animationId String?
  formationId String?
  stageId     String?
}

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

**Caching Strategy:**

| Layer | Strategy | TTL | Rationale |
|-------|----------|-----|-----------|
| Public pages | ISR | 60s | Fresh content, good performance |
| Billetweb API | In-memory cache | 5min | Reduce API calls, acceptable staleness |
| Static assets | CDN headers | 1 year | Immutable after build |

### Authentication & Security

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Auth Method | JWT simple | Single admin, no complexity needed |
| Password Hashing | bcrypt | Industry standard, secure |
| Token Storage | httpOnly cookie | XSS protection |
| Token Expiry | 24h + refresh | Balance security/UX |
| Route Protection | Next.js Middleware | Centralized, performant |

**Security Implementation:**

```typescript
// middleware.ts - Route protection
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth-token')
    if (!token || !verifyJWT(token.value)) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
}
```

**Additional Security Measures:**
- CSRF tokens for mutations
- Input validation (zod)
- SQL injection prevention (Prisma parameterized queries)
- XSS prevention (React default escaping)
- Image upload validation (type, size limits)

### API & Communication Patterns

| Decision | Choice | Rationale |
|----------|--------|-----------|
| API Style | REST via API Routes | Simple, well understood |
| Validation | Zod | Type-safe, good DX |
| Error Format | Consistent JSON | Predictable client handling |

**API Routes Structure:**

```
/api/auth/login          POST   - Admin login
/api/auth/logout         POST   - Admin logout
/api/auth/me             GET    - Current admin

/api/animations          GET    - List (public)
/api/animations          POST   - Create (admin)
/api/animations/[id]     GET    - Detail (public)
/api/animations/[id]     PUT    - Update (admin)
/api/animations/[id]     DELETE - Delete (admin)

/api/formations          GET, POST
/api/formations/[id]     GET, PUT, DELETE

/api/stages              GET, POST
/api/stages/[id]         GET, PUT, DELETE

/api/agenda              GET, POST
/api/agenda/[id]         GET, PUT, DELETE

/api/billetweb/sync      POST   - Trigger sync (admin/cron)
/api/upload              POST   - S3 image upload (admin)
/api/webhooks/contact    POST   - Send to n8n
```

**Billetweb Integration:**

```typescript
// lib/billetweb.ts
export class BilletwebService {
  async getEventPlaces(eventId: string): Promise<{total: number, left: number}>
  async syncAllEvents(): Promise<SyncResult>
}

// Fallback: If API fails, admin can manually set "complet" status
```

**n8n Webhook Payload:**

```typescript
interface ContactWebhook {
  type: 'contact_form'
  timestamp: string
  data: {
    subject: string  // Catégorie sélectionnée
    name: string
    email: string
    message: string
  }
}
```

### Frontend Architecture

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Default Components | Server Components | SEO, performance |
| State Management | React Context | Minimal needs (theme only) |
| Styling | CSS Modules + cie4 vars | Preserve design system |
| Forms | React Hook Form + Zod | Type-safe, good UX |

**Component Strategy:**

| Type | Rendering | Examples |
|------|-----------|----------|
| Pages | Server | Home, Animations list, Contact |
| Cards | Server | ActivityCard, AgendaItem |
| Interactive | Client | FilterBar, DarkModeToggle, Forms |
| Admin | Client | CRUD forms, image upload |

**Client Components (Minimal):**

```typescript
'use client'
// Only these need client-side JS:
// - ThemeProvider (dark mode)
// - FilterBar (animations, stages)
// - ContactForm
// - Admin CRUD forms
// - ImageUpload
```

### Infrastructure & Deployment

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Container | Docker multi-stage | Small image, secure |
| Orchestration | docker-compose | Simple for single VPS |
| Hosting | Hetzner VPS | Cost-effective, EU data |
| Storage | Hetzner S3 | Same provider, S3-compatible |
| SSL | Let's Encrypt | Free, automatic |

**Dockerfile (Multi-stage):**

```dockerfile
# Build stage
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

# Production stage
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
EXPOSE 3000
CMD ["node", "server.js"]
```

**docker-compose.yml:**

```yaml
version: '3.8'
services:
  web:
    build: .
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=file:/app/data/prod.db
      - AUTH_SECRET=${AUTH_SECRET}
      - S3_ENDPOINT=${S3_ENDPOINT}
      - S3_ACCESS_KEY=${S3_ACCESS_KEY}
      - S3_SECRET_KEY=${S3_SECRET_KEY}
      - N8N_WEBHOOK_URL=${N8N_WEBHOOK_URL}
      - BILLETWEB_API_KEY=${BILLETWEB_API_KEY}
    volumes:
      - ./data:/app/data
      - ./uploads:/app/uploads
```

### Decision Impact Analysis

**Implementation Sequence:**
1. Project init + Prisma schema
2. Auth system (JWT + middleware)
3. API routes (CRUD)
4. Public pages (Server Components)
5. Admin backoffice (Client Components)
6. Integrations (Billetweb, S3, n8n)
7. Docker deployment

**Cross-Component Dependencies:**

```
Prisma Schema → API Routes → Frontend Pages
     ↓              ↓
Auth Middleware → Admin Routes
     ↓
Billetweb Service → Badge Logic → Cards
     ↓
S3 Service → Image Upload → Forms
```

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:** 15 areas where AI agents could make different choices, now standardized.

### Naming Patterns

**Database Naming (Prisma):**

| Element | Convention | Example |
|---------|------------|---------|
| Models | PascalCase | `Animation`, `AgendaEvent` |
| Fields | camelCase | `createdAt`, `billetwebUrl` |
| Relations | camelCase pluriel | `tags`, `images`, `formations` |
| Enums | PascalCase | `SourceType` |

**API Naming:**

| Element | Convention | Example |
|---------|------------|---------|
| Endpoints | pluriel, kebab-case | `/api/animations`, `/api/agenda-events` |
| Query params | camelCase | `?pageSize=10&sortBy=date` |
| Route params | `[id]` format | `/api/animations/[id]` |

**Code Naming:**

| Element | Convention | Example |
|---------|------------|---------|
| Components | PascalCase | `ActivityCard.tsx` |
| Utilities/lib | kebab-case | `billetweb-service.ts` |
| CSS Modules | même nom | `ActivityCard.module.css` |
| Variables | camelCase | `userId`, `isLoading` |
| Types/Interfaces | PascalCase | `AnimationData`, `FormSubmitHandler` |

### Structure Patterns

**Test Organization:**
```
src/
├── components/
│   ├── ActivityCard.tsx
│   └── ActivityCard.test.tsx      # Co-located
├── lib/
│   ├── billetweb-service.ts
│   └── billetweb-service.test.ts  # Co-located
```

**Component Organization:**
```
src/components/
├── ui/           # Button, Card, Input, Badge
├── layout/       # Navbar, Footer, Sidebar
├── forms/        # ContactForm, AdminForm
└── features/     # ActivityCard, AgendaItem, FilterBar
```

**Lib Organization:**
```
src/lib/
├── prisma.ts           # Prisma client singleton
├── auth.ts             # JWT utils
├── validations/        # Zod schemas
├── services/           # billetweb-service.ts, s3-service.ts
└── utils/              # date-utils.ts, format-utils.ts
```

### Format Patterns

**API Response - Success:**
```typescript
// Single item
{ data: Animation }

// List with pagination
{
  data: Animation[],
  meta: { total: number, page: number, pageSize: number }
}
```

**API Response - Error:**
```typescript
{
  error: {
    code: 'VALIDATION_ERROR' | 'NOT_FOUND' | 'UNAUTHORIZED' | 'FORBIDDEN' | 'SERVER_ERROR',
    message: string,
    details?: Record<string, string[]>  // Validation errors by field
  }
}
```

**Date Formats:**

| Context | Format | Example |
|---------|--------|---------|
| JSON/API | ISO 8601 | `"2026-01-26T14:30:00Z"` |
| Database | DateTime | Prisma DateTime type |
| Display FR | Localized | `"26 janvier 2026"` |
| Display short | DD/MM/YYYY | `"26/01/2026"` |

**JSON Field Naming:** camelCase throughout API responses

### Communication Patterns

**Audit Events:**
```typescript
// Naming: entity.action
'animation.created'
'animation.updated'
'animation.deleted'
'admin.login'
'billetweb.synced'
```

**State Management (Minimal):**
```typescript
// Theme only - React Context
interface ThemeContext {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}
```

### Process Patterns

**Async State Pattern:**
```typescript
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }
```

**API Route Error Handling:**
```typescript
export async function GET(request: Request) {
  try {
    const data = await prisma.animation.findMany()
    return Response.json({ data })
  } catch (error) {
    console.error('[GET /api/animations]', error)
    return Response.json(
      { error: { code: 'SERVER_ERROR', message: 'Erreur serveur' } },
      { status: 500 }
    )
  }
}
```

**Validation Pattern:**
```typescript
// Shared schema between API and forms
const animationSchema = z.object({
  titre: z.string().min(3).max(100),
  description: z.string().min(10),
  niveau: z.enum(['M1', 'M2/M3', 'P1-P2', 'P3-P4', 'P5-P6', 'S1-S3', 'S4-S6']),
  published: z.boolean().default(false)
})

// API validation
const validated = animationSchema.parse(body)
```

### Enforcement Guidelines

**All AI Agents MUST:**

1. **TypeScript strict mode** - No `any`, explicit interfaces for all data
2. **Prisma for all DB access** - Never raw SQL
3. **Zod for all validation** - Schemas shared between API and forms
4. **Server Components default** - `'use client'` only when necessary
5. **CSS Modules for styles** - No inline styles except dynamic values
6. **ISO dates in API** - Format only on client display
7. **Consistent error format** - Always `{ error: { code, message } }`
8. **Co-located tests** - Test files next to source files

**Pattern Verification:**
- ESLint rules enforce naming conventions
- TypeScript strict mode catches type issues
- PR review checklist includes pattern compliance

### Pattern Examples

**✅ Good - Complete API Route:**
```typescript
// src/app/api/animations/route.ts
import { prisma } from '@/lib/prisma'
import { animationCreateSchema } from '@/lib/validations/animation'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  const animations = await prisma.animation.findMany({
    where: { published: true },
    include: { tags: true, images: true },
    orderBy: { createdAt: 'desc' }
  })
  return Response.json({ data: animations })
}

export async function POST(request: Request) {
  const admin = await requireAdmin(request)
  if (!admin) {
    return Response.json(
      { error: { code: 'UNAUTHORIZED', message: 'Non autorisé' } },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    const validated = animationCreateSchema.parse(body)
    const animation = await prisma.animation.create({ data: validated })

    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: 'animation.created',
        entity: 'Animation',
        entityId: animation.id
      }
    })

    return Response.json({ data: animation }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Données invalides', details: error.flatten().fieldErrors } },
        { status: 400 }
      )
    }
    throw error
  }
}
```

**❌ Anti-Patterns to Avoid:**
```typescript
// ❌ No validation
const data = await req.json()
await prisma.animation.create({ data })

// ❌ Inconsistent error format
return new Response('Error', { status: 500 })

// ❌ Using any
const handleSubmit = (data: any) => { }

// ❌ Raw SQL
await prisma.$queryRaw`SELECT * FROM animations`

// ❌ Inline styles
<div style={{ color: 'red' }}>

// ❌ Missing 'use client' for interactive
export function FilterBar() {
  const [filter, setFilter] = useState('')  // Error!
}
```

## Project Structure & Boundaries

### Requirements to Structure Mapping

| FR Category | Directory/Files |
|-------------|----------------|
| Content Management (FR1-13) | `src/app/admin/`, `src/app/api/` |
| Agenda System (FR14-17) | `src/app/api/agenda/`, `src/lib/services/agenda-service.ts` |
| Billetweb Integration (FR18-20) | `src/lib/services/billetweb-service.ts` |
| Content Discovery (FR21-28) | `src/app/(public)/`, `src/components/features/` |
| Status Badges (FR29-32) | `src/components/ui/Badge.tsx`, `src/lib/services/badge-service.ts` |
| Contact & Communication (FR33-35) | `src/app/api/webhooks/`, `src/components/forms/` |
| Authentication (FR36-38) | `src/app/api/auth/`, `src/lib/auth.ts`, `src/middleware.ts` |
| User Experience (FR39-42) | `src/components/layout/`, `src/components/providers/` |
| Design Fidelity (FR43-56) | `src/styles/`, `src/components/` |

### Complete Project Directory Structure

```
cie-website/
├── README.md
├── package.json
├── package-lock.json
├── next.config.ts
├── tsconfig.json
├── .env.local                    # Variables locales (git ignored)
├── .env.example                  # Template pour .env
├── .gitignore
├── .eslintrc.json
├── Dockerfile
├── docker-compose.yml
├── docker-compose.prod.yml
│
├── .github/
│   └── workflows/
│       └── ci.yml                # Build + lint + test
│
├── prisma/
│   ├── schema.prisma             # Schéma complet
│   ├── seed.ts                   # Données initiales
│   └── migrations/
│
├── public/
│   ├── favicon.ico
│   ├── robots.txt
│   ├── sitemap.xml
│   └── img/
│       ├── logo.svg
│       ├── icons/                # 11 SVG cie4
│       └── photos/
│
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── not-found.tsx
│   │   ├── error.tsx
│   │   │
│   │   ├── (public)/
│   │   │   ├── page.tsx                    # Accueil
│   │   │   ├── le-cie/
│   │   │   │   └── page.tsx
│   │   │   ├── animations/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx
│   │   │   ├── formations/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx
│   │   │   ├── stages/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx
│   │   │   ├── agenda/
│   │   │   │   └── page.tsx
│   │   │   └── contact/
│   │   │       └── page.tsx
│   │   │
│   │   ├── login/
│   │   │   └── page.tsx
│   │   │
│   │   ├── admin/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── animations/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── edit/
│   │   │   │           └── page.tsx
│   │   │   ├── formations/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── edit/
│   │   │   │           └── page.tsx
│   │   │   ├── stages/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── edit/
│   │   │   │           └── page.tsx
│   │   │   ├── agenda/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── edit/
│   │   │   │           └── page.tsx
│   │   │   ├── categories/
│   │   │   │   └── page.tsx
│   │   │   └── tags/
│   │   │       └── page.tsx
│   │   │
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── login/
│   │       │   │   └── route.ts
│   │       │   ├── logout/
│   │       │   │   └── route.ts
│   │       │   └── me/
│   │       │       └── route.ts
│   │       ├── animations/
│   │       │   ├── route.ts
│   │       │   └── [id]/
│   │       │       └── route.ts
│   │       ├── formations/
│   │       │   ├── route.ts
│   │       │   └── [id]/
│   │       │       └── route.ts
│   │       ├── stages/
│   │       │   ├── route.ts
│   │       │   └── [id]/
│   │       │       └── route.ts
│   │       ├── agenda/
│   │       │   ├── route.ts
│   │       │   └── [id]/
│   │       │       └── route.ts
│   │       ├── categories/
│   │       │   ├── route.ts
│   │       │   └── [id]/
│   │       │       └── route.ts
│   │       ├── tags/
│   │       │   ├── route.ts
│   │       │   └── [id]/
│   │       │       └── route.ts
│   │       ├── upload/
│   │       │   └── route.ts
│   │       ├── billetweb/
│   │       │   └── sync/
│   │       │       └── route.ts
│   │       └── webhooks/
│   │           └── contact/
│   │               └── route.ts
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.module.css
│   │   │   ├── Card.tsx
│   │   │   ├── Card.module.css
│   │   │   ├── Badge.tsx
│   │   │   ├── Badge.module.css
│   │   │   ├── Input.tsx
│   │   │   ├── Input.module.css
│   │   │   ├── Select.tsx
│   │   │   ├── Textarea.tsx
│   │   │   ├── DateBox.tsx
│   │   │   ├── DateBox.module.css
│   │   │   ├── Icon.tsx
│   │   │   └── Spinner.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Navbar.module.css
│   │   │   ├── Footer.tsx
│   │   │   ├── Footer.module.css
│   │   │   ├── Hero.tsx
│   │   │   ├── Hero.module.css
│   │   │   ├── StatsBar.tsx
│   │   │   ├── StatsBar.module.css
│   │   │   ├── Section.tsx
│   │   │   ├── AdminSidebar.tsx
│   │   │   └── AdminSidebar.module.css
│   │   │
│   │   ├── features/
│   │   │   ├── ActivityCard.tsx
│   │   │   ├── ActivityCard.module.css
│   │   │   ├── AgendaItem.tsx
│   │   │   ├── AgendaItem.module.css
│   │   │   ├── FormationCard.tsx
│   │   │   ├── FormationCard.module.css
│   │   │   ├── StageCard.tsx
│   │   │   ├── StageCard.module.css
│   │   │   ├── FilterBar.tsx
│   │   │   ├── FilterBar.module.css
│   │   │   ├── AgendaCalendar.tsx
│   │   │   ├── TeamMember.tsx
│   │   │   └── TeamMember.module.css
│   │   │
│   │   ├── forms/
│   │   │   ├── ContactForm.tsx
│   │   │   ├── ContactForm.module.css
│   │   │   ├── LoginForm.tsx
│   │   │   ├── AnimationForm.tsx
│   │   │   ├── FormationForm.tsx
│   │   │   ├── StageForm.tsx
│   │   │   ├── AgendaEventForm.tsx
│   │   │   └── ImageUpload.tsx
│   │   │
│   │   └── providers/
│   │       └── ThemeProvider.tsx
│   │
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   │
│   │   ├── validations/
│   │   │   ├── animation.ts
│   │   │   ├── formation.ts
│   │   │   ├── stage.ts
│   │   │   ├── agenda-event.ts
│   │   │   ├── contact.ts
│   │   │   └── auth.ts
│   │   │
│   │   ├── services/
│   │   │   ├── billetweb-service.ts
│   │   │   ├── billetweb-service.test.ts
│   │   │   ├── s3-service.ts
│   │   │   ├── s3-service.test.ts
│   │   │   ├── webhook-service.ts
│   │   │   ├── agenda-service.ts
│   │   │   └── badge-service.ts
│   │   │
│   │   └── utils/
│   │       ├── date-utils.ts
│   │       ├── date-utils.test.ts
│   │       ├── slug-utils.ts
│   │       └── cn.ts
│   │
│   ├── styles/
│   │   ├── variables.css
│   │   ├── typography.css
│   │   ├── animations.css
│   │   └── admin.css
│   │
│   ├── types/
│   │   ├── index.ts
│   │   ├── api.ts
│   │   ├── entities.ts
│   │   └── billetweb.ts
│   │
│   ├── hooks/
│   │   ├── useTheme.ts
│   │   └── useMediaQuery.ts
│   │
│   └── middleware.ts
│
├── tests/
│   ├── setup.ts
│   ├── mocks/
│   │   ├── prisma.ts
│   │   └── billetweb.ts
│   └── e2e/
│       ├── playwright.config.ts
│       ├── home.spec.ts
│       ├── animations.spec.ts
│       └── admin.spec.ts
│
└── scripts/
    ├── seed.ts
    └── sync-billetweb.ts
```

### Architectural Boundaries

**API Boundaries:**

| Boundary | Routes | Auth |
|----------|--------|------|
| Public Read | `GET /api/animations`, `GET /api/formations`, `GET /api/stages`, `GET /api/agenda` | None |
| Public Write | `POST /api/webhooks/contact` | None |
| Admin CRUD | `POST/PUT/DELETE /api/*` | JWT Required |
| Admin Utils | `POST /api/upload`, `POST /api/billetweb/sync` | JWT Required |

**Component Boundaries:**

| Type | Rendering | State Access |
|------|-----------|--------------|
| Pages | Server | Prisma direct |
| Cards | Server | Props from parent |
| Interactive | Client | Local state + API calls |
| Forms | Client | React Hook Form |

**Service Boundaries:**

| Service | Responsibility | Dependencies |
|---------|----------------|--------------|
| `prisma.ts` | DB access singleton | None |
| `auth.ts` | JWT sign/verify | None |
| `billetweb-service.ts` | External API sync | Prisma |
| `s3-service.ts` | Image upload | AWS SDK |
| `webhook-service.ts` | n8n notifications | fetch |
| `agenda-service.ts` | Auto-generate events | Prisma |
| `badge-service.ts` | Badge logic | Prisma, Billetweb |

### Integration Points

**Internal Communication:**
```
Page (Server) → Prisma → SQLite
     ↓
Client Component → API Route → Prisma → SQLite
     ↓
API Route → Service → External API
```

**External Integrations:**

| Integration | Endpoint | Direction |
|-------------|----------|-----------|
| Billetweb | `api.billetweb.fr` | Inbound (sync places) |
| Hetzner S3 | `s3.hetzner.com` | Outbound (upload images) |
| n8n | Webhook URL | Outbound (notifications) |

**Data Flow - Public Page:**
```
Browser Request
     ↓
Next.js Server Component
     ↓
Prisma Query (cached via ISR)
     ↓
SQLite
     ↓
Rendered HTML
```

**Data Flow - Admin Action:**
```
Admin Form Submit
     ↓
Client-side Validation (Zod)
     ↓
API Route POST
     ↓
Server-side Validation (Zod)
     ↓
Prisma Create/Update
     ↓
Audit Log
     ↓
ISR Revalidation
```

### File Organization Patterns

**Configuration Files:**
- Root level: `next.config.ts`, `tsconfig.json`, `.eslintrc.json`
- Environment: `.env.local` (secrets), `.env.example` (template)
- Docker: `Dockerfile`, `docker-compose.yml`

**Source Organization:**
- Routes: `src/app/` (App Router)
- Components: `src/components/` (by type: ui, layout, features, forms)
- Logic: `src/lib/` (services, validations, utils)
- Types: `src/types/`

**Test Organization:**
- Unit tests: Co-located with source files (`.test.ts`)
- E2E tests: `tests/e2e/`
- Mocks: `tests/mocks/`

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
All technology choices work together without conflicts:
- Next.js 16 + React 19 + TypeScript 5.x = Fully compatible
- Prisma 7.2 + SQLite = Excellent fit for small data volume
- CSS Modules + CSS Variables = Native Next.js support
- Docker + Node.js 22 Alpine = Optimized production images

**Pattern Consistency:**
Implementation patterns fully support architectural decisions:
- Naming conventions align with TypeScript/React community standards
- Structure patterns leverage App Router conventions
- API patterns follow REST best practices
- Error handling consistent across all layers

**Structure Alignment:**
Project structure enables all architectural decisions:
- Clear separation between public and admin routes
- Service layer properly isolated from API routes
- Component boundaries respect Server/Client rendering model
- Integration points well-defined and isolated

### Requirements Coverage Validation ✅

**Functional Requirements Coverage (56 FRs):**

| Category | Count | Status |
|----------|-------|--------|
| Content Management (FR1-13) | 13 | ✅ 100% |
| Agenda System (FR14-17) | 4 | ✅ 100% |
| Billetweb Integration (FR18-20) | 3 | ✅ 100% |
| Content Discovery (FR21-28) | 8 | ✅ 100% |
| Status Badges (FR29-32) | 4 | ✅ 100% |
| Contact & Communication (FR33-35) | 3 | ✅ 100% |
| Authentication (FR36-38) | 3 | ✅ 100% |
| User Experience (FR39-42) | 4 | ✅ 100% |
| Design Fidelity (FR43-56) | 14 | ✅ 100% |

**Non-Functional Requirements Coverage (32 NFRs):**

| Category | Count | Status |
|----------|-------|--------|
| Performance (NFR1-7) | 7 | ✅ ISR, Server Components |
| Security (NFR8-14) | 7 | ✅ JWT, bcrypt, Zod, Prisma |
| Accessibility (NFR15-22) | 8 | ✅ cie4 a11y preserved |
| Integration (NFR23-28) | 6 | ✅ Service layer + fallbacks |
| Reliability (NFR29-32) | 4 | ✅ Docker, logging |

### Implementation Readiness Validation ✅

**Decision Completeness:**
- ✅ All critical decisions documented with specific versions
- ✅ Technology rationale provided for each choice
- ✅ Integration patterns fully specified
- ✅ Fallback strategies defined for external dependencies

**Structure Completeness:**
- ✅ 100+ files and directories explicitly defined
- ✅ All routes (public, admin, API) specified
- ✅ All components organized by type
- ✅ All services and utilities defined

**Pattern Completeness:**
- ✅ Naming conventions cover all code types
- ✅ API response formats standardized
- ✅ Error handling patterns defined with examples
- ✅ Anti-patterns documented to avoid

### Gap Analysis Results

**Critical Gaps:** None identified ✅

**Important Gaps:** None identified ✅

**Nice-to-Have (Post-MVP):**
- APM/Monitoring configuration (e.g., Sentry)
- CI/CD secrets management details
- Database backup automation script
- Rate limiting configuration

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed (Medium)
- [x] Technical constraints identified (cie4 pixel-perfect, Billetweb API)
- [x] Cross-cutting concerns mapped (Auth, Caching, Design System, Error Handling)

**✅ Architectural Decisions**
- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined (Billetweb, S3, n8n)
- [x] Performance considerations addressed (ISR, Server Components)

**✅ Implementation Patterns**
- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**✅ Project Structure**
- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** ✅ READY FOR IMPLEMENTATION

**Confidence Level:** HIGH

**Key Strengths:**
1. Modern, well-supported technology stack (Next.js 16, Prisma 7.2)
2. Existing design system (cie4) reduces UI decision complexity
3. Simple but extensible architecture (plugin pattern for integrations)
4. Clear patterns ensure consistency across AI agent implementations
5. SQLite simplifies deployment while meeting data requirements

**Areas for Future Enhancement (Post-MVP):**
- Multi-admin roles and permissions
- Analytics dashboard
- Advanced caching strategies
- Multi-language support

### Implementation Handoff

**AI Agent Guidelines:**
1. Follow all architectural decisions exactly as documented
2. Use implementation patterns consistently across all components
3. Respect project structure and component boundaries
4. Use specified technology versions
5. Refer to this document for all architectural questions

**First Implementation Step:**
```bash
npx create-next-app@latest cie-website --typescript --eslint --no-tailwind --app --src-dir
```

**Implementation Sequence:**
1. Project initialization + Prisma schema
2. Authentication system (JWT + middleware)
3. API routes (CRUD for 4 entities)
4. Public pages (Server Components)
5. Admin backoffice (Client Components)
6. Integrations (Billetweb, S3, n8n)
7. Docker deployment configuration

## Architecture Completion Summary

### Workflow Completion

**Architecture Decision Workflow:** COMPLETED ✅
**Total Steps Completed:** 8
**Date Completed:** 2026-01-26
**Document Location:** `docs/planning-artifacts/architecture.md`

### Final Architecture Deliverables

**📋 Complete Architecture Document**
- All architectural decisions documented with specific versions
- Implementation patterns ensuring AI agent consistency
- Complete project structure with all files and directories
- Requirements to architecture mapping
- Validation confirming coherence and completeness

**🏗️ Implementation Ready Foundation**
- 25+ architectural decisions made
- 15+ implementation patterns defined
- 100+ files and directories specified
- 88 requirements (56 FR + 32 NFR) fully supported

**📚 AI Agent Implementation Guide**
- Technology stack: Next.js 16, Prisma 7.2, SQLite, TypeScript
- Consistency rules preventing implementation conflicts
- Project structure with clear boundaries
- Integration patterns for Billetweb, S3, n8n

### Quality Assurance Checklist

**✅ Architecture Coherence**
- [x] All decisions work together without conflicts
- [x] Technology choices are compatible
- [x] Patterns support the architectural decisions
- [x] Structure aligns with all choices

**✅ Requirements Coverage**
- [x] All 56 functional requirements are supported
- [x] All 32 non-functional requirements are addressed
- [x] Cross-cutting concerns are handled
- [x] Integration points are defined

**✅ Implementation Readiness**
- [x] Decisions are specific and actionable
- [x] Patterns prevent agent conflicts
- [x] Structure is complete and unambiguous
- [x] Examples are provided for clarity

---

**Architecture Status:** ✅ READY FOR IMPLEMENTATION

**Next Phase:** Create Epics & Stories using `/bmad:bmm:workflows:create-epics-and-stories`

