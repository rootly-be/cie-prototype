# Story 8.3: Configure Caddy for SSL and Reverse Proxy

Status: done

## Story

As a **developer**,
I want **Caddy configured for HTTPS**,
So that **the site is secure and production-ready**.

## Acceptance Criteria

1. **AC1:** Automatic Let's Encrypt SSL (NFR8)
2. **AC2:** Reverse proxy to Next.js app
3. **AC3:** HTTP to HTTPS redirect
4. **AC4:** Security headers configured

## Tasks / Subtasks

- [x] Task 1: Create Caddyfile
- [x] Task 2: Add Caddy to docker-compose.prod.yml
- [x] Task 3: Configure security headers

## Dev Notes

See Caddyfile for configuration.

---

## Change Log

| Date | Change | Reason |
|------|--------|--------|
| 2026-02-01 | Story created and implemented | Third story in Epic 8 |

## Dev Agent Record

### File List

- `Caddyfile` - Created: Reverse proxy with SSL and security headers
- `docker-compose.prod.yml` - Modified: Added Caddy service
