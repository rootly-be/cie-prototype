# Architecture Documentation - CIE Website

> Generated: 2026-01-13 | Scan Level: Deep

## Executive Summary

CIE Enghien website is currently a **static HTML/CSS/JS prototype** (cie4/) that showcases an environmental education center. The project is planned for transformation into a dynamic web application with a React/Vue frontend, RESTful API backend, and PostgreSQL database.

## Current Architecture (Prototype)

### Architecture Type
**Static Multi-Page Application (MPA)**

```
┌─────────────────────────────────────────────────────┐
│                    Browser                          │
├─────────────────────────────────────────────────────┤
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │index.html│ │cie.html │ │agenda   │ │contact  │   │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘   │
│       │           │           │           │         │
│       └───────────┴─────┬─────┴───────────┘         │
│                         │                           │
│              ┌──────────┴──────────┐                │
│              │     style.css       │                │
│              │  (Design System)    │                │
│              └──────────┬──────────┘                │
│                         │                           │
│              ┌──────────┴──────────┐                │
│              │     script.js       │                │
│              │  (Interactions)     │                │
│              └─────────────────────┘                │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│              External Resources                     │
│  ┌──────────────┐  ┌──────────────────────────┐    │
│  │ Google Fonts │  │ cieenghien.be (images)   │    │
│  └──────────────┘  └──────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Markup | HTML5 | - | Semantic structure |
| Styling | CSS3 | - | Design system with variables |
| Scripting | JavaScript | ES6+ | DOM interactions |
| Fonts | Google Fonts | - | Playfair Display, Lora |
| Icons | SVG | - | 11 custom icons |

### Design System Architecture

```
CSS Variables (Theme Tokens)
├── Color Palette
│   ├── Light Mode (--L-*)
│   └── Dark Mode (--D-*)
├── Typography
│   ├── Font Families
│   └── Size Scale
├── Spacing
│   └── Border Radii
└── Effects
    ├── Shadows
    └── Focus Rings

Active Mappings (--color-*, --bg-*, --text-*)
├── Default: Light Mode
└── .dark-mode: Dark Mode overrides
```

### Component Architecture

```
Components (29 total)
├── Layout (4)
│   ├── Container
│   ├── Section
│   └── Grid Systems
├── Navigation (3)
│   ├── Navbar
│   ├── Mobile Menu
│   └── Skip Link
├── Buttons (3)
│   ├── Primary
│   ├── Outline
│   └── Disabled
├── Cards (4)
│   ├── Activity Card
│   ├── Agenda Item
│   ├── Date Box
│   └── Stats Item
├── Forms (3)
│   ├── Input
│   ├── Form Box
│   └── Form Group
├── Heroes (2)
│   ├── Full-Screen Hero
│   └── Page Header
└── Interactive (3)
    ├── Theme Toggle
    ├── Filter Buttons
    └── Event Tags
```

## Target Architecture (Dynamic Version)

Based on `Functional-requirements.md`:

```
┌─────────────────────────────────────────────────────┐
│                    Frontend                         │
│        (React/Next.js or Vue.js)                   │
├─────────────────────────────────────────────────────┤
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │ Public  │ │ Admin   │ │ Shared  │ │ Hooks/  │   │
│  │ Pages   │ │ Pages   │ │ Comps   │ │ Context │   │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘   │
│       └───────────┴─────┬─────┴───────────┘         │
│                         │                           │
│              ┌──────────┴──────────┐                │
│              │    API Client       │                │
│              │   (fetch/axios)     │                │
│              └──────────┬──────────┘                │
└─────────────────────────┼───────────────────────────┘
                          │ HTTP/REST
┌─────────────────────────┼───────────────────────────┐
│                    Backend                          │
│       (Node.js/Express or Python/FastAPI)          │
├─────────────────────────┼───────────────────────────┤
│              ┌──────────┴──────────┐                │
│              │    API Routes       │                │
│              └──────────┬──────────┘                │
│       ┌─────────────────┼─────────────────┐         │
│  ┌────┴────┐ ┌──────────┴──────────┐ ┌────┴────┐   │
│  │ Auth    │ │    Controllers      │ │ Upload  │   │
│  │ (JWT)   │ │    /Services        │ │ (S3?)   │   │
│  └─────────┘ └──────────┬──────────┘ └─────────┘   │
│                         │                           │
│              ┌──────────┴──────────┐                │
│              │    Data Layer       │                │
│              │   (ORM/Prisma)      │                │
│              └──────────┬──────────┘                │
└─────────────────────────┼───────────────────────────┘
                          │
┌─────────────────────────┼───────────────────────────┐
│              ┌──────────┴──────────┐                │
│              │    PostgreSQL       │                │
│              │    Database         │                │
│              └─────────────────────┘                │
└─────────────────────────────────────────────────────┘
```

### Data Architecture (Target)

```
PostgreSQL Schema
├── animations
│   ├── id (PK)
│   ├── category_id (FK → animation_categories)
│   ├── title, description, image_url
│   ├── period, location
│   ├── is_published
│   └── timestamps
├── animation_categories
│   └── id, name, description
├── formations
│   ├── id (PK)
│   ├── category_id (FK → formation_categories)
│   ├── title, description, image_url
│   ├── price, duration, sessions, max_participants
│   ├── location, register_link
│   ├── is_published
│   └── timestamps
├── formation_categories
│   └── id, name, description
├── stages
│   ├── id (PK)
│   ├── category_id (FK → stage_categories)
│   ├── title, description, image_url
│   ├── price, max_participants, total_days
│   ├── start_date, end_date, location
│   ├── register_link, is_published
│   └── timestamps
├── stage_categories
│   └── id, name, description
├── agenda_items
│   ├── id (PK)
│   ├── tag_id (FK → agenda_tags)
│   ├── date, title, time_from, time_to
│   ├── location, register_link
│   ├── is_published
│   └── timestamps
└── agenda_tags
    └── id, name, color
```

### API Architecture (Target)

```
Public Endpoints (No Auth)
├── GET /api/animations
├── GET /api/animations/:id
├── GET /api/formations
├── GET /api/formations/:id
├── GET /api/stages
├── GET /api/stages/:id
├── GET /api/agenda
└── GET /api/agenda/:id

Admin Endpoints (JWT Required)
├── POST   /api/admin/animations
├── PUT    /api/admin/animations/:id
├── DELETE /api/admin/animations/:id
├── POST   /api/admin/formations
├── PUT    /api/admin/formations/:id
├── DELETE /api/admin/formations/:id
├── POST   /api/admin/stages
├── PUT    /api/admin/stages/:id
├── DELETE /api/admin/stages/:id
├── POST   /api/admin/agenda
├── PUT    /api/admin/agenda/:id
└── DELETE /api/admin/agenda/:id
```

## Architectural Decisions

### Current (Prototype)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | None (vanilla) | Simplicity, no build step |
| Styling | CSS Variables | Theming, dark mode |
| State | DOM + class toggling | Minimal state needs |
| Routing | File-based | Static site |

### Target (Dynamic)

| Decision | Options | Recommendation |
|----------|---------|----------------|
| Frontend | React/Next.js, Vue.js | Next.js (SSR, API routes) |
| Backend | Express, FastAPI | Node.js/Express (JS ecosystem) |
| Database | PostgreSQL | ✓ (per requirements) |
| ORM | Prisma, TypeORM | Prisma (modern, type-safe) |
| Auth | JWT, Sessions | JWT (stateless API) |
| Hosting | Vercel, Railway | Vercel (Next.js native) |

## Accessibility Architecture

```
Accessibility Features
├── Semantic HTML
│   ├── <nav>, <main>, <article>, <section>
│   └── Proper heading hierarchy
├── Keyboard Navigation
│   ├── Skip link to main content
│   ├── Focus-visible states
│   └── Tab order preserved
├── Visual Accessibility
│   ├── WCAG AA contrast ratios
│   ├── Responsive text scaling
│   └── Dark mode option
└── Motion Accessibility
    └── prefers-reduced-motion support
```

## Performance Considerations

### Current
- No build/bundle step
- External font loading (render-blocking)
- External images (network dependent)
- ~86 KB total prototype size

### Recommendations
- Self-host fonts for critical rendering path
- Image optimization (WebP, lazy loading)
- CSS/JS minification for production
- Consider CDN for static assets

## Security Considerations (Target)

```
Security Layers
├── Frontend
│   ├── XSS prevention (sanitize inputs)
│   └── HTTPS only
├── API
│   ├── JWT validation on admin routes
│   ├── Rate limiting
│   ├── Input validation
│   └── CORS configuration
├── Database
│   ├── Parameterized queries (ORM)
│   ├── Least privilege access
│   └── Connection pooling
└── Infrastructure
    ├── Environment variables for secrets
    ├── Regular dependency updates
    └── Monitoring and logging
```

## Migration Strategy

### Phase 1: Setup
1. Initialize Next.js/Vue project
2. Set up PostgreSQL database
3. Define Prisma schema from data models
4. Configure authentication

### Phase 2: Backend
1. Implement API routes
2. Create admin CRUD endpoints
3. Add validation and error handling
4. Seed database with current content

### Phase 3: Frontend
1. Convert HTML components to React/Vue
2. Implement public pages
3. Build admin dashboard
4. Integrate with API

### Phase 4: Polish
1. Testing (unit, integration, E2E)
2. Performance optimization
3. Accessibility audit
4. Deployment pipeline
