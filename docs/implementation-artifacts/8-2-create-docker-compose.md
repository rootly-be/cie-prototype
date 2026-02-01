# Story 8.2: Create docker-compose for VPS Deployment

Status: done

## Story

As a **developer**,
I want **docker-compose configuration**,
So that **deployment on Hetzner VPS is simple**.

## Acceptance Criteria

1. **AC1:** App service is defined
   - **Given** Docker image exists
   - **When** docker-compose is created
   - **Then** app service runs the Next.js application

2. **AC2:** Volumes for SQLite persistence
   - **Given** app uses SQLite
   - **When** container restarts
   - **Then** data persists via volume

3. **AC3:** Environment file support
   - **Given** secrets need to be configured
   - **When** deploying
   - **Then** .env file is loaded

4. **AC4:** Restart policy for auto-restart (NFR30)
   - **Given** container crashes or server reboots
   - **When** Docker daemon starts
   - **Then** container auto-restarts

## Tasks / Subtasks

- [x] Task 1: Create docker-compose.yml
  - [x] Define app service
  - [x] Add volume for SQLite (cie-data, cie-uploads)
  - [x] Configure restart policy (unless-stopped)
  - [x] Add health check

- [x] Task 2: Create docker-compose.prod.yml
  - [x] Production overrides (image instead of build)
  - [x] Resource limits (2 CPU, 1G RAM)
  - [x] Logging configuration

- [x] Task 3: Update .env.example
  - [x] Document all required variables including Billetweb

## Dev Notes

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| DATABASE_URL | SQLite database path | file:/app/data/prod.db |
| AUTH_SECRET | JWT secret (32+ chars) | openssl rand -base64 32 |
| BILLETWEB_API_KEY | Billetweb API key | xxx |
| BILLETWEB_API_URL | Billetweb API URL | https://www.billetweb.fr/api |

### References

- [Source: docs/planning-artifacts/epics.md#Story 8.2]
- [Source: docs/planning-artifacts/architecture.md#NFR30]

---

## Change Log

| Date | Change | Reason |
|------|--------|--------|
| 2026-02-01 | Story created | Second story in Epic 8 |
| 2026-02-01 | Implementation complete | All tasks done |

## Dev Agent Record

### File List

- `docker-compose.yml` - Created: App service with volumes and health check
- `docker-compose.prod.yml` - Created: Production overrides with resource limits
- `.env.example` - Modified: Added Billetweb variables

### Deployment Instructions

```bash
# 1. Copy environment file
cp .env.example .env

# 2. Edit .env with production values
nano .env

# 3. Build and start
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# 4. Check status
docker compose ps
docker compose logs -f app
```
