# Story 8.1: Create Docker Multi-Stage Build

Status: done

## Story

As a **developer**,
I want **a production-ready Docker image**,
So that **the app can be deployed consistently**.

## Acceptance Criteria

1. **AC1:** Multi-stage build produces small image
   - **Given** Next.js app is complete
   - **When** Docker build runs
   - **Then** multi-stage build produces optimized image

2. **AC2:** Node.js 22 Alpine base
   - **Given** Docker build runs
   - **When** image is created
   - **Then** uses Node.js 22 Alpine as base

3. **AC3:** Health check endpoint works
   - **Given** container is running
   - **When** health check is called
   - **Then** returns healthy status

4. **AC4:** Environment variables configurable
   - **Given** container is running
   - **When** env vars are set
   - **Then** app uses configured values

## Tasks / Subtasks

- [x] Task 1: Create health check API endpoint
  - [x] Create `/api/health` endpoint
  - [x] Return status, version, uptime, timestamp, environment

- [x] Task 2: Create Dockerfile
  - [x] Multi-stage build (deps, builder, runner)
  - [x] Node.js 22 Slim base (not Alpine due to libsql compatibility)
  - [x] Standalone output mode
  - [x] Non-root user for security (nextjs:nodejs)
  - [x] HEALTHCHECK directive

- [x] Task 3: Create .dockerignore
  - [x] Exclude node_modules, .git, docs, tests, etc.

- [x] Task 4: Update next.config.ts
  - [x] Enable standalone output

- [x] Task 5: Verify build
  - [x] Run `docker build` successfully (image: 506MB)
  - [x] Test health endpoint (returns healthy)

## Dev Notes

### Multi-Stage Build Strategy

1. **deps stage**: Install dependencies only
2. **builder stage**: Build Next.js app
3. **runner stage**: Minimal production image

### Next.js Standalone Output

```typescript
// next.config.ts
output: 'standalone'
```

This creates a minimal production build with only required files.

### Health Endpoint Response

```json
{
  "status": "healthy",
  "version": "1.0.0",
  "uptime": 12345,
  "timestamp": "2026-02-01T12:00:00Z"
}
```

### References

- [Source: docs/planning-artifacts/epics.md#Story 8.1]
- [Source: docs/planning-artifacts/architecture.md#NFR8]

---

## Change Log

| Date | Change | Reason |
|------|--------|--------|
| 2026-02-01 | Story created | First story in Epic 8 |
| 2026-02-01 | Implementation complete | All tasks done, Docker image tested |
| 2026-02-01 | Code review passed | Fixed H1 (migrations), M1 (DB health), M2 (permissions) |

## Dev Agent Record

### File List

- `Dockerfile` - Created: Multi-stage build (deps → builder → runner)
- `docker-entrypoint.sh` - Created: Handles migrations before startup (H1 fix)
- `.dockerignore` - Created: Excludes dev files, docs, tests, all .env files
- `src/app/api/health/route.ts` - Created: Health check with DB connectivity (M1 fix)
- `src/app/admin/page.tsx` - Modified: Added `force-dynamic` for build compatibility
- `next.config.ts` - Modified: Added `output: 'standalone'`

### Build Results

- **Image size:** 506MB (Node.js 22 slim with Next.js + Prisma + libsql)
- **Base:** node:22-slim (Debian, for libsql compatibility)
- **Health check:** `/api/health` returns `{"status":"healthy","checks":{"database":"healthy"},...}`

### Code Review Fixes Applied

- **H1**: Created `docker-entrypoint.sh` to run `prisma migrate deploy` before starting
- **M1**: Health check now verifies database connectivity with `SELECT 1`
- **M2**: All Prisma files copied with `--chown=nextjs:nodejs`
- **L2**: Updated `.dockerignore` to exclude all `.env*` files
