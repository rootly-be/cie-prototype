---
project_name: 'cie-website'
date: '2026-01-26'
architecture_ref: 'docs/planning-artifacts/architecture.md'
---

# Project Context for AI Agents

_Critical rules that AI agents must follow when implementing code. Focus on unobvious details._

---

## Technology Stack & Versions

| Technology | Version | Notes |
|------------|---------|-------|
| Next.js | 16.x | App Router, Turbopack |
| React | 19.x | Server Components default |
| TypeScript | 5.x | Strict mode required |
| Prisma | 7.2.0 | SQLite database |
| Node.js | 22 | Alpine for Docker |
| Zod | Latest | API + form validation |

---

## Critical Implementation Rules

### TypeScript Rules

- **ALWAYS use strict mode** - No `any` types, explicit interfaces
- **Use `@/` path aliases** - Import from `@/lib/`, `@/components/`
- **Prefer `interface` over `type`** for object shapes
- **Export types separately** - `export type { AnimationData }`

### Next.js App Router Rules

- **Server Components by default** - Only add `'use client'` when needed
- **Client Components ONLY for:**
  - `useState`, `useEffect`, `useContext`
  - Event handlers (`onClick`, `onChange`)
  - Browser APIs (`localStorage`, `window`)
- **Use Route Groups** - `(public)/` for visitor pages, `admin/` for backoffice
- **ISR for public pages** - `export const revalidate = 60`

### Prisma Rules

- **NEVER use raw SQL** - Always use Prisma query builder
- **Use `include` for relations** - Not separate queries
- **Singleton pattern** - Import from `@/lib/prisma`

```typescript
// ✅ Correct
import { prisma } from '@/lib/prisma'
const data = await prisma.animation.findMany({
  include: { tags: true, images: true }
})

// ❌ Wrong
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
```

### API Response Format

**ALWAYS use this exact format:**

```typescript
// Success
{ data: T | T[] }
{ data: T[], meta: { total, page, pageSize } }

// Error
{ error: { code: string, message: string, details?: Record<string, string[]> } }
```

**Error codes:** `VALIDATION_ERROR`, `NOT_FOUND`, `UNAUTHORIZED`, `FORBIDDEN`, `SERVER_ERROR`

### CSS & Styling Rules

- **CSS Modules only** - `Component.module.css`
- **Use cie4 CSS variables** - Never hardcode colors
- **NO inline styles** except dynamic values

```css
/* ✅ Use variables */
color: var(--L-sapin);
font-family: var(--font-heading);

/* ❌ Never hardcode */
color: #1a4a26;
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `ActivityCard.tsx` |
| Utilities | kebab-case | `date-utils.ts` |
| API routes | kebab-case folders | `/api/agenda-events/` |
| Variables | camelCase | `const userId` |
| Types/Interfaces | PascalCase | `interface AnimationData` |
| CSS Modules | Same as component | `ActivityCard.module.css` |

### Code Organization Rules

**KEEP FILES SMALL - Maximum ~200-300 lines per file**

- **Split large components** - Extract sub-components into separate files
- **One component per file** - No multiple exports of components
- **Extract hooks** - Custom hooks go in `hooks/useXxx.ts`
- **Extract utils** - Helper functions go in `lib/utils/`
- **Extract types** - Shared types go in `types/`

**Signs a file needs splitting:**
- More than 200-300 lines
- Multiple unrelated functions
- Hard to find what you're looking for
- Component has too many responsibilities

**Example - Splitting a large component:**

```typescript
// ❌ BAD: Everything in one file (500+ lines)
// src/components/features/AnimationCard.tsx
export function AnimationCard() {
  // 50 lines of hooks
  // 100 lines of handlers
  // 200 lines of JSX
  // 50 lines of sub-components
}

// ✅ GOOD: Split into focused files
// src/components/features/AnimationCard/index.tsx (main component, ~100 lines)
// src/components/features/AnimationCard/AnimationCardHeader.tsx (~50 lines)
// src/components/features/AnimationCard/AnimationCardBody.tsx (~80 lines)
// src/components/features/AnimationCard/useAnimationCard.ts (hook, ~40 lines)
// src/components/features/AnimationCard/AnimationCard.module.css
```

**For API routes - Extract logic to services:**

```typescript
// ❌ BAD: 500 lines in route.ts
// src/app/api/animations/route.ts
export async function POST(request: Request) {
  // 200 lines of validation
  // 150 lines of business logic
  // 100 lines of error handling
}

// ✅ GOOD: Route stays lean, logic in services
// src/app/api/animations/route.ts (~50 lines)
import { createAnimation } from '@/lib/services/animation-service'

export async function POST(request: Request) {
  const body = await request.json()
  const result = await createAnimation(body)
  return Response.json({ data: result })
}

// src/lib/services/animation-service.ts (~150 lines)
export async function createAnimation(data: CreateAnimationInput) {
  // validation, business logic, etc.
}
```

### Testing Rules

- **Co-locate tests** - `Component.test.tsx` next to `Component.tsx`
- **Use Vitest** for unit tests
- **Use Playwright** for E2E tests
- **Mock Prisma** - Use `tests/mocks/prisma.ts`

### Validation Rules

- **Zod for all validation** - Shared between API and forms
- **Validate on server** - Even if client validates

```typescript
// ✅ Always validate
const validated = animationSchema.parse(body)

// ❌ Never trust input
await prisma.animation.create({ data: body })
```

---

## Anti-Patterns to AVOID

```typescript
// ❌ Using 'any'
const data: any = await fetch()

// ❌ Missing 'use client' for hooks
export function FilterBar() {
  const [filter, setFilter] = useState('')  // Error!
}

// ❌ Inconsistent error response
return new Response('Error', { status: 500 })

// ❌ Raw SQL
await prisma.$queryRaw`SELECT * FROM animations`

// ❌ New Prisma instance
const prisma = new PrismaClient()

// ❌ Hardcoded colors
<div style={{ color: '#1a4a26' }}>

// ❌ Files with 500+ lines
// Split into smaller, focused files!
```

---

## File Organization

```
src/
├── app/           # Routes (App Router)
├── components/
│   ├── ui/        # Button, Card, Badge, Input
│   ├── layout/    # Navbar, Footer, Hero
│   ├── features/  # ActivityCard, AgendaItem (can be folders)
│   └── forms/     # ContactForm, AdminForm
├── lib/
│   ├── prisma.ts       # DB client singleton
│   ├── auth.ts         # JWT utils
│   ├── validations/    # Zod schemas
│   ├── services/       # billetweb, s3, webhook, animation
│   └── utils/          # date-utils, slug-utils
├── hooks/         # Custom React hooks
├── types/         # Shared TypeScript types
└── styles/        # CSS variables, typography
```

---

## Quick Reference

**Create Server Component:**

```typescript
// src/app/(public)/animations/page.tsx
import { prisma } from '@/lib/prisma'

export const revalidate = 60

export default async function AnimationsPage() {
  const animations = await prisma.animation.findMany({
    where: { published: true }
  })
  return <div>{/* render */}</div>
}
```

**Create Client Component:**

```typescript
// src/components/features/FilterBar.tsx
'use client'

import { useState } from 'react'
import styles from './FilterBar.module.css'

export function FilterBar({ onFilter }: Props) {
  const [value, setValue] = useState('')
  return <div className={styles.container}>...</div>
}
```

**Create API Route:**

```typescript
// src/app/api/animations/route.ts
import { prisma } from '@/lib/prisma'
import { animationSchema } from '@/lib/validations/animation'

export async function GET() {
  const data = await prisma.animation.findMany()
  return Response.json({ data })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validated = animationSchema.parse(body)
    const data = await prisma.animation.create({ data: validated })
    return Response.json({ data }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid data' } },
        { status: 400 }
      )
    }
    throw error
  }
}
```

---

_Refer to `docs/planning-artifacts/architecture.md` for complete architectural decisions._
