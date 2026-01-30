---
stepsCompleted: [1, 2, 3, 4]
status: complete
inputDocuments:
  - 'docs/planning-artifacts/prd.md'
  - 'docs/planning-artifacts/architecture.md'
  - 'docs/component-inventory.md'
---

# CIE Website - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for cie-website, decomposing the requirements from the PRD and Architecture into implementable stories.

## Requirements Inventory

### Functional Requirements (56 FRs)

**Content Management (Admin) — FR1-FR13**
- FR1: Admin can CRUD Animations
- FR2: Admin can CRUD Formations
- FR3: Admin can CRUD Stages
- FR4: Admin can CRUD manual Agenda events
- FR5: Admin can manage Animation categories
- FR6: Admin can manage Formation categories
- FR7: Admin can manage Stage categories
- FR8: Admin can manage Agenda tags (with color)
- FR9: Admin can manage cross-entity tags
- FR10: Admin can upload images
- FR11: Admin can preview before publishing
- FR12: Admin can publish/unpublish content
- FR13: Admin can mark Stage/Formation as "Full" manually

**Agenda System — FR14-FR17**
- FR14: System auto-generates Agenda from Formations with dates
- FR15: System auto-generates Agenda from Stages
- FR16: Admin can create standalone Agenda events
- FR17: System displays Agenda chronologically with date grouping

**Billetweb Integration — FR18-FR20**
- FR18: System syncs available places from Billetweb API
- FR19: System auto-updates badges based on Billetweb data
- FR20: Visitor can click registration link to Billetweb

**Content Discovery (Visitors) — FR21-FR28**
- FR21: Visitor can browse Animations by school level
- FR22: Visitor can browse Animations by category
- FR23: Visitor can browse Formations by category
- FR24: Visitor can browse Stages by age group
- FR25: Visitor can browse Stages by period/season
- FR26: Visitor can view Agenda by month
- FR27: Visitor can filter any list by tags
- FR28: Visitor can view detailed content pages

**Status Badges — FR29-FR32**
- FR29: System displays "Nouveau" badge (< 7 days)
- FR30: System displays "Complet" badge (no places)
- FR31: System displays "Dernières places" badge (below threshold)
- FR32: System displays "Inscriptions bientôt" badge (no link yet)

**Contact & Communication — FR33-FR35**
- FR33: Visitor can submit contact form with subject
- FR34: System sends webhook to n8n on form submit
- FR35: Visitor receives confirmation after submit

**Authentication & Security — FR36-FR38**
- FR36: Admin can log in with secure credentials
- FR37: System restricts backoffice to authenticated admins
- FR38: System logs admin actions for audit

**User Experience — FR39-FR42**
- FR39: Visitor can toggle light/dark mode
- FR40: System preserves theme preference
- FR41: Visitor can navigate with keyboard only
- FR42: System provides skip-link to main content

**Design Fidelity (cie4 Exact Match) — FR43-FR56**
- FR43: Exact color palette (L-sapin, L-feuille, L-écorce, L-eau)
- FR44: Exact typography (Playfair Display, Lora)
- FR45: All 29 UI components from cie4
- FR46: Exact 7-page structure
- FR47: Exact breakpoints (768px, 1024px)
- FR48: Exact dark mode mappings
- FR49: Exact scroll animations (fade-in-up)
- FR50: Exact navbar behavior (transparent → solid)
- FR51: Exact button styles
- FR52: Exact card components
- FR53: Exact form styling
- FR54: Exact hero sections
- FR55: Exact stats-bar component
- FR56: Exact footer

### Non-Functional Requirements (32 NFRs)

**Performance — NFR1-NFR7**
- NFR1: Page load < 3s (3G)
- NFR2: Lighthouse Performance > 90
- NFR3: Lighthouse SEO > 90
- NFR4: Lighthouse Best Practices > 90
- NFR5: TTFB < 600ms
- NFR6: FCP < 1.8s
- NFR7: LCP < 2.5s

**Security — NFR8-NFR14**
- NFR8: HTTPS only
- NFR9: Passwords hashed (bcrypt)
- NFR10: JWT expiry 24h with refresh
- NFR11: CSRF protection
- NFR12: Image upload validation
- NFR13: SQL injection prevention (ORM)
- NFR14: XSS prevention

**Accessibility — NFR15-NFR22**
- NFR15: WCAG 2.1 AA compliance
- NFR16: Lighthouse Accessibility > 90
- NFR17: All images have alt text
- NFR18: Color contrast 4.5:1 minimum
- NFR19: Keyboard accessible
- NFR20: Visible focus states
- NFR21: Skip-link functional
- NFR22: Respects prefers-reduced-motion

**Integration — NFR23-NFR28**
- NFR23: Billetweb sync < 30s
- NFR24: Billetweb graceful degradation
- NFR25: n8n webhook < 5s
- NFR26: n8n retry (3 attempts)
- NFR27: S3 upload < 10s
- NFR28: S3 error handling

**Reliability — NFR29-NFR32**
- NFR29: Uptime 99%
- NFR30: Auto-restart on crash
- NFR31: Daily backups (30-day retention)
- NFR32: Structured error logging

### Additional Requirements (from Architecture)

**Starter Template (CRITICAL for Epic 1, Story 1):**
```bash
npx create-next-app@latest cie-website --typescript --eslint --no-tailwind --app --src-dir
```

**Infrastructure Requirements:**
- Docker multi-stage build for production
- docker-compose for VPS deployment
- Hetzner VPS hosting
- Let's Encrypt SSL

**Database Requirements:**
- Prisma 7.2 ORM with SQLite
- Schema for 4 entities: Animation, Formation, Stage, AgendaEvent
- Supporting entities: Category, Tag, Image, Admin, AuditLog

**Integration Requirements:**
- Billetweb API for places sync (first plugin)
- Hetzner S3 for image storage (AWS SDK compatible)
- n8n webhook for contact notifications

**Code Organization Requirements:**
- Server Components by default
- Client Components only for interactivity
- CSS Modules with cie4 variables
- Max 200-300 lines per file
- Co-located tests

### FR Coverage Map

| FR | Epic | Description |
|----|------|-------------|
| FR1-13 | Epic 3 | Content Management (CRUD, categories, tags, images) |
| FR14-17 | Epic 6 | Agenda System (auto-generation, manual events) |
| FR18-20 | Epic 7 | Billetweb Integration (sync, badges, links) |
| FR21-28 | Epic 5 | Content Discovery (browse, filter, detail pages) |
| FR29-32 | Epic 7 | Status Badges (Nouveau, Complet, etc.) |
| FR33-35 | Epic 4 | Contact & Communication (form, webhook, confirmation) |
| FR36-38 | Epic 2 | Authentication & Security (login, protection, audit) |
| FR39-42 | Epic 4 | User Experience (dark mode, keyboard nav, skip-link) |
| FR43-56 | Epic 1 | Design Fidelity (cie4 pixel-perfect) |

## Epic List

### Epic 1: Project Foundation & Design System
Initialize Next.js project with pixel-perfect cie4 design system, establishing the visual foundation for all subsequent development.

**User Value:** Developers can build with the correct design patterns from day one.
**FRs covered:** FR43, FR44, FR45, FR46, FR47, FR48, FR49, FR50, FR51, FR52, FR53, FR54, FR55, FR56

---

### Epic 2: Authentication & Admin Shell
Admin can securely log in and access the protected backoffice dashboard.

**User Value:** Nathalie can access her secure administration space.
**FRs covered:** FR36, FR37, FR38

---

### Epic 3: Content Management
Admin can fully manage all content types with CRUD operations, categories, tags, and image uploads.

**User Value:** Nathalie can create, edit, and publish content in under 5 minutes.
**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR8, FR9, FR10, FR11, FR12, FR13

---

### Epic 4: Public Website - Static Pages
Visitors can navigate the static pages with full cie4 design, dark mode, accessibility features, and contact functionality.

**User Value:** Sophie and Marc discover the CIE, its team, and can contact them.
**FRs covered:** FR33, FR34, FR35, FR39, FR40, FR41, FR42, FR46

---

### Epic 5: Dynamic Content Discovery
Visitors can browse and filter dynamic content (animations, formations, stages) with multiple filter options.

**User Value:** Sophie finds a stage for Lucas in under 3 clicks.
**FRs covered:** FR21, FR22, FR23, FR24, FR25, FR26, FR27, FR28

---

### Epic 6: Agenda System
Hybrid agenda system with auto-generated events from formations/stages and manual event creation.

**User Value:** Visitors see all upcoming events organized chronologically by date.
**FRs covered:** FR14, FR15, FR16, FR17

---

### Epic 7: Billetweb Integration & Status Badges
Real-time availability sync from Billetweb API with automatic status badges.

**User Value:** Sophie sees "Dernières places" and registers before it's full.
**FRs covered:** FR18, FR19, FR20, FR29, FR30, FR31, FR32

---

### Epic 8: Production Deployment
Site deployed and operational on Hetzner VPS with Docker, SSL, and reliability features.

**User Value:** The site is accessible to the public 24/7 with 99% uptime.
**NFRs covered:** NFR8, NFR29, NFR30, NFR31, NFR32

---

## Epic 1: Project Foundation & Design System

Initialize Next.js project with pixel-perfect cie4 design system, establishing the visual foundation for all subsequent development.

### Story 1.1: Initialize Next.js Project with TypeScript

As a **developer**,
I want **the Next.js project initialized with TypeScript, ESLint, and proper folder structure**,
So that **I have a solid foundation to build upon**.

**Acceptance Criteria:**

**Given** no existing project
**When** running the initialization command
**Then** a Next.js 16 project is created with:
- TypeScript strict mode enabled
- ESLint configured
- App Router with `src/` directory
- Path aliases (`@/`) configured
**And** the project runs locally without errors

---

### Story 1.2: Set Up Prisma with SQLite Database

As a **developer**,
I want **Prisma ORM configured with SQLite**,
So that **I can define and interact with the database**.

**Acceptance Criteria:**

**Given** the Next.js project exists
**When** Prisma is initialized
**Then** `prisma/schema.prisma` exists with SQLite provider
**And** `@/lib/prisma.ts` singleton is created
**And** `npx prisma db push` runs successfully
**And** basic Prisma client can query the database

---

### Story 1.3: Port cie4 CSS Variables and Typography

As a **visitor**,
I want **the site to use the exact cie4 color palette and typography**,
So that **the design matches the approved mockup**.

**Acceptance Criteria:**

**Given** the Next.js project
**When** CSS variables are ported from cie4
**Then** all color variables are available (L-sapin, L-feuille, L-écorce, L-eau)
**And** fonts (Playfair Display, Lora) are loaded from Google Fonts
**And** typography classes match cie4 exactly
**And** dark mode variables are defined (FR48)

---

### Story 1.4: Create Base UI Components (Button, Badge, Card)

As a **developer**,
I want **reusable UI components matching cie4 design**,
So that **I can build pages with consistent styling**.

**Acceptance Criteria:**

**Given** CSS variables are set up
**When** base components are created
**Then** `Button` component matches cie4 (primary, outline, disabled states) (FR51)
**And** `Badge` component supports all status types (FR29-32)
**And** `Card` component matches cie4 card styling (FR52)
**And** components use CSS Modules
**And** components are accessible (keyboard focus visible)

---

### Story 1.5: Create Layout Components (Navbar, Footer, Hero)

As a **visitor**,
I want **the navigation and page structure to match cie4**,
So that **I can navigate the site with the expected design**.

**Acceptance Criteria:**

**Given** base UI components exist
**When** layout components are created
**Then** `Navbar` has transparent → solid scroll behavior (FR50)
**And** `Footer` matches cie4 exactly (FR56)
**And** `Hero` component matches cie4 sections (FR54)
**And** `StatsBar` component works (FR55)
**And** responsive breakpoints work (768px, 1024px) (FR47)

---

### Story 1.6: Implement Dark Mode Toggle

As a **visitor**,
I want **to toggle between light and dark mode**,
So that **I can use my preferred theme**.

**Acceptance Criteria:**

**Given** CSS dark mode variables exist
**When** user clicks the theme toggle
**Then** theme switches between light and dark (FR39)
**And** preference is saved to localStorage (FR40)
**And** colors match cie4 dark mode mappings exactly (FR48)
**And** ThemeProvider is a Client Component

---

### Story 1.7: Add Scroll Animations

As a **visitor**,
I want **smooth fade-in animations when scrolling**,
So that **the site feels polished and engaging**.

**Acceptance Criteria:**

**Given** layout components exist
**When** page sections come into view
**Then** fade-in-up animation triggers (FR49)
**And** animation respects `prefers-reduced-motion` (NFR22)
**And** animation matches cie4 timing exactly

---

### Story 1.8: Create Form Components

As a **visitor**,
I want **forms that match cie4 styling**,
So that **I have a consistent experience when filling forms**.

**Acceptance Criteria:**

**Given** base UI components exist
**When** form components are created
**Then** `Input`, `Textarea`, `Select` match cie4 (FR53)
**And** focus states are visible
**And** validation error states are styled
**And** components are accessible

---

## Epic 2: Authentication & Admin Shell

Admin can securely log in and access the protected backoffice dashboard.

### Story 2.1: Create Admin Database Schema

As a **developer**,
I want **the Admin and AuditLog tables defined in Prisma**,
So that **I can store admin credentials and track actions**.

**Acceptance Criteria:**

**Given** Prisma is set up
**When** Admin schema is defined
**Then** `Admin` table exists with `id`, `email`, `passwordHash`, `createdAt`
**And** `AuditLog` table exists with `id`, `adminId`, `action`, `entityType`, `entityId`, `timestamp`
**And** migrations run successfully

---

### Story 2.2: Implement Login API with JWT

As an **admin**,
I want **to log in with email and password**,
So that **I can access the backoffice**.

**Acceptance Criteria:**

**Given** an admin exists in the database
**When** submitting valid credentials to `/api/auth/login`
**Then** a JWT token is returned (24h expiry) (FR36)
**And** password is verified with bcrypt (NFR9)
**When** submitting invalid credentials
**Then** error response with code `UNAUTHORIZED` is returned

---

### Story 2.3: Create Auth Middleware for Admin Routes

As a **developer**,
I want **middleware that protects admin routes**,
So that **only authenticated admins can access the backoffice**.

**Acceptance Criteria:**

**Given** JWT authentication is implemented
**When** accessing `/admin/*` routes
**Then** middleware validates JWT token (FR37)
**And** invalid/missing token returns 401
**And** valid token allows access
**And** admin info is available in request context

---

### Story 2.4: Build Admin Login Page

As an **admin**,
I want **a login page with email/password form**,
So that **I can authenticate to access the backoffice**.

**Acceptance Criteria:**

**Given** login API exists
**When** visiting `/admin/login`
**Then** login form is displayed with cie4 styling (FR53)
**And** form validates client-side before submit
**And** successful login redirects to `/admin`
**And** failed login shows error message
**And** form is accessible (keyboard, labels)

---

## Epic 3: Content Management

Admin can fully manage all content types with CRUD operations, categories, tags, and image uploads.

### Story 3.1: Create Full Database Schema

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

---

### Story 3.2: Build Animation CRUD API

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

---

### Story 3.3: Build Formation CRUD API

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

---

### Story 3.4: Build Stage CRUD API

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

---

### Story 3.5: Build Category and Tag Management API

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

---

### Story 3.6: Implement Image Upload to S3

As an **admin**,
I want **to upload images for content**,
So that **I can add visuals to animations, formations, stages**.

**Acceptance Criteria:**

**Given** Hetzner S3 credentials are configured
**When** uploading an image
**Then** image is validated (type, size) (NFR12)
**And** image is uploaded to S3 bucket (FR10)
**And** URL is returned and stored in database
**And** upload completes in < 10s (NFR27)
**And** errors are handled gracefully (NFR28)

---

### Story 3.7: Build Admin Content List and Form Pages

As an **admin**,
I want **UI pages to manage all content**,
So that **I can use the backoffice without API knowledge**.

**Acceptance Criteria:**

**Given** CRUD APIs exist
**When** admin pages are built
**Then** list pages show content with filters
**And** form pages allow create/edit
**And** preview before publish works (FR11)
**And** publish/unpublish toggle works (FR12)
**And** forms use cie4 styling (FR53)

---

## Epic 4: Public Website - Static Pages

Visitors can navigate the static pages with full cie4 design, dark mode, accessibility features, and contact functionality.

### Story 4.1: Create Homepage

As a **visitor**,
I want **to see the CIE homepage**,
So that **I can discover the organization and its offerings**.

**Acceptance Criteria:**

**Given** layout components exist
**When** homepage is built
**Then** page matches cie4/index.html exactly (FR46)
**And** Hero section with call-to-action
**And** StatsBar displays key numbers (FR55)
**And** featured content sections
**And** ISR with 60s revalidation

---

### Story 4.2: Create About Page (CIE)

As a **visitor**,
I want **to learn about the CIE organization**,
So that **I understand their mission and team**.

**Acceptance Criteria:**

**Given** layout components exist
**When** about page is built
**Then** page matches cie4/cie.html exactly (FR46)
**And** team section with photos
**And** mission statement
**And** history timeline

---

### Story 4.3: Create Contact Page with Form

As a **visitor**,
I want **to contact the CIE**,
So that **I can ask questions or request information**.

**Acceptance Criteria:**

**Given** form components exist
**When** contact page is built
**Then** page matches cie4/contact.html (FR46)
**And** form has subject dropdown (FR33)
**And** form validates with Zod
**And** submit sends webhook to n8n (FR34)
**And** confirmation message appears (FR35)
**And** webhook completes in < 5s (NFR25)
**And** 3 retry attempts on failure (NFR26)

---

### Story 4.4: Implement Skip-Link and Keyboard Navigation

As a **visitor using keyboard**,
I want **to navigate the site without a mouse**,
So that **I can access all content accessibly**.

**Acceptance Criteria:**

**Given** pages exist
**When** accessibility features are added
**Then** skip-link to main content works (FR42)
**And** all interactive elements are keyboard accessible (FR41)
**And** focus order is logical
**And** focus states are visible (NFR20)
**And** WCAG 2.1 AA compliance (NFR15)

---

### Story 4.5: Implement prefers-reduced-motion Support

As a **visitor with motion sensitivity**,
I want **animations to be reduced**,
So that **I can use the site comfortably**.

**Acceptance Criteria:**

**Given** scroll animations exist
**When** `prefers-reduced-motion: reduce` is set
**Then** fade animations are disabled or instant (NFR22)
**And** navbar transition is instant
**And** no jarring movements occur

---

## Epic 5: Dynamic Content Discovery

Visitors can browse and filter dynamic content (animations, formations, stages) with multiple filter options.

### Story 5.1: Build Animations List Page with Filters

As a **visitor**,
I want **to browse animations by school level and category**,
So that **I can find programs suitable for my class**.

**Acceptance Criteria:**

**Given** Animation data exists
**When** animations page is built
**Then** list displays published animations
**And** filter by school level works (FR21)
**And** filter by category works (FR22)
**And** filter by tags works (FR27)
**And** cards match cie4 design (FR52)
**And** "Nouveau" badge shows for < 7 days old (FR29)

---

### Story 5.2: Build Formations List Page with Filters

As a **visitor**,
I want **to browse formations by category**,
So that **I can find adult training that interests me**.

**Acceptance Criteria:**

**Given** Formation data exists
**When** formations page is built
**Then** list displays published formations
**And** filter by category works (FR23)
**And** filter by tags works (FR27)
**And** status badges show (FR29-32)

---

### Story 5.3: Build Stages List Page with Filters

As a **visitor**,
I want **to browse stages by age group and period**,
So that **I can find a camp for my child**.

**Acceptance Criteria:**

**Given** Stage data exists
**When** stages page is built
**Then** list displays published stages
**And** filter by age group works (FR24)
**And** filter by period/season works (FR25)
**And** filter by tags works (FR27)
**And** status badges show (FR29-32)

---

### Story 5.4: Build Detail Pages for All Content Types

As a **visitor**,
I want **to view detailed information about content**,
So that **I can decide to register or learn more**.

**Acceptance Criteria:**

**Given** list pages exist
**When** clicking on a card
**Then** detail page shows full information (FR28)
**And** images display correctly
**And** registration link works (if available)
**And** back navigation works
**And** page is SEO optimized (NFR3)

---

### Story 5.5: Create Reusable FilterBar Component

As a **developer**,
I want **a reusable filter component**,
So that **all list pages have consistent filtering**.

**Acceptance Criteria:**

**Given** filter requirements exist
**When** FilterBar is created
**Then** component accepts filter configuration
**And** supports multiple filter types (select, tag chips)
**And** updates URL params for shareability
**And** is a Client Component with `'use client'`

---

### Story 5.6: Create ActivityCard Component for All Content Types

As a **developer**,
I want **a unified card component for activities**,
So that **animations, formations, stages display consistently**.

**Acceptance Criteria:**

**Given** Card base component exists
**When** ActivityCard is created
**Then** supports all content types
**And** displays badges (Nouveau, Complet, etc.)
**And** matches cie4 card design (FR52)
**And** is accessible (alt text, focus)

---

## Epic 6: Agenda System

Hybrid agenda system with auto-generated events from formations/stages and manual event creation.

### Story 6.1: Build Agenda Event CRUD API

As an **admin**,
I want **API endpoints to manage standalone Agenda events**,
So that **I can add events not linked to formations/stages**.

**Acceptance Criteria:**

**Given** database schema exists
**When** AgendaEvent API is created
**Then** CRUD for manual events works (FR4, FR16)
**And** events have date, title, description, location
**And** events can have tags with colors (FR8)
**And** mutations are logged (FR38)

---

### Story 6.2: Implement Auto-Generated Agenda from Formations/Stages

As a **developer**,
I want **the system to auto-generate agenda entries**,
So that **formations and stages with dates appear in the agenda**.

**Acceptance Criteria:**

**Given** Formations and Stages have date fields
**When** querying the agenda
**Then** Formation dates create agenda entries (FR14)
**And** Stage dates create agenda entries (FR15)
**And** auto-generated entries link to parent entity
**And** changes to parent propagate to agenda

---

### Story 6.3: Build Agenda Page with Month Navigation

As a **visitor**,
I want **to view the agenda organized by month**,
So that **I can see upcoming events chronologically**.

**Acceptance Criteria:**

**Given** Agenda data exists (manual + auto)
**When** agenda page is built
**Then** events display chronologically (FR17)
**And** grouped by date
**And** month navigation works (FR26)
**And** filter by tags works (FR27)
**And** matches cie4/agenda.html design

---

## Epic 7: Billetweb Integration & Status Badges

Real-time availability sync from Billetweb API with automatic status badges.

### Story 7.1: Create Billetweb Sync Service

As a **developer**,
I want **a service that fetches data from Billetweb API**,
So that **availability is kept in sync**.

**Acceptance Criteria:**

**Given** Billetweb API credentials exist
**When** sync service runs
**Then** available places are fetched (FR18)
**And** sync completes in < 30s (NFR23)
**And** graceful degradation on API failure (NFR24)
**And** results are cached appropriately

---

### Story 7.2: Implement Automatic Status Badge Logic

As a **visitor**,
I want **to see accurate status badges on content**,
So that **I know availability at a glance**.

**Acceptance Criteria:**

**Given** Billetweb sync provides places data
**When** displaying content
**Then** "Nouveau" shows if created < 7 days ago (FR29)
**And** "Complet" shows if places = 0 (FR30)
**And** "Dernières places" shows if below threshold (FR31)
**And** "Inscriptions bientôt" shows if no link yet (FR32)
**And** badges update automatically (FR19)

---

### Story 7.3: Add Registration Links to Content

As a **visitor**,
I want **to click a link to register on Billetweb**,
So that **I can sign up for activities**.

**Acceptance Criteria:**

**Given** content has Billetweb link
**When** registration link is displayed
**Then** link opens Billetweb in new tab (FR20)
**And** link is styled as primary button
**And** link is accessible (aria-label)

---

### Story 7.4: Create Scheduled Sync Job

As a **developer**,
I want **Billetweb sync to run automatically**,
So that **data stays fresh without manual intervention**.

**Acceptance Criteria:**

**Given** sync service exists
**When** scheduled job is configured
**Then** sync runs every 15 minutes
**And** errors are logged (NFR32)
**And** job can be triggered manually

---

## Epic 8: Production Deployment

Site deployed and operational on Hetzner VPS with Docker, SSL, and reliability features.

### Story 8.1: Create Docker Multi-Stage Build

As a **developer**,
I want **a production-ready Docker image**,
So that **the app can be deployed consistently**.

**Acceptance Criteria:**

**Given** Next.js app is complete
**When** Docker build runs
**Then** multi-stage build produces small image
**And** Node.js 22 Alpine base
**And** health check endpoint works
**And** environment variables configurable

---

### Story 8.2: Create docker-compose for VPS Deployment

As a **developer**,
I want **docker-compose configuration**,
So that **deployment on Hetzner VPS is simple**.

**Acceptance Criteria:**

**Given** Docker image exists
**When** docker-compose is created
**Then** app service is defined
**And** volumes for SQLite persistence
**And** environment file support
**And** restart policy for auto-restart (NFR30)

---

### Story 8.3: Configure Caddy for SSL and Reverse Proxy

As a **developer**,
I want **Caddy configured for HTTPS**,
So that **the site is secure and production-ready**.

**Acceptance Criteria:**

**Given** docker-compose exists
**When** Caddy is configured
**Then** automatic Let's Encrypt SSL (NFR8)
**And** reverse proxy to Next.js app
**And** HTTP to HTTPS redirect
**And** security headers configured

---

### Story 8.4: Set Up Backup and Monitoring

As a **developer**,
I want **automated backups and basic monitoring**,
So that **data is safe and issues are detected**.

**Acceptance Criteria:**

**Given** production deployment exists
**When** backup/monitoring is configured
**Then** daily SQLite backups (NFR31)
**And** 30-day retention
**And** structured error logging (NFR32)
**And** uptime monitoring configured
**And** 99% uptime target (NFR29)

