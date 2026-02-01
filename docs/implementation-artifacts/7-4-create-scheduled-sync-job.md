# Story 7.4: Create Scheduled Sync Job

Status: done

## Story

As a **developer**,
I want **Billetweb sync to run automatically**,
So that **data stays fresh without manual intervention**.

## Acceptance Criteria

1. **AC1:** Sync runs every 15 minutes
   - **Given** sync service exists
   - **When** scheduled job is configured
   - **Then** sync runs automatically every 15 minutes

2. **AC2:** Errors are logged (NFR32)
   - **Given** sync job runs
   - **When** an error occurs
   - **Then** error is logged with details

3. **AC3:** Job can be triggered manually
   - **Given** sync job exists
   - **When** admin triggers manual sync
   - **Then** sync runs immediately

## Tasks / Subtasks

- [x] Task 1: Create scheduler service
  - [x] Create `src/lib/services/sync-scheduler.ts`
  - [x] Implement setInterval-based scheduler (simpler than node-cron)
  - [x] Configure 15-minute interval

- [x] Task 2: Add logging for sync operations
  - [x] Log sync start, completion, and errors
  - [x] Include timestamps and duration
  - [x] Log number of events synced

- [x] Task 3: Integrate with existing sync API
  - [x] Update `/api/billetweb/sync` to use scheduler status
  - [x] Add scheduler info to GET endpoint

- [x] Task 4: Create initialization hook
  - [x] Create `src/instrumentation.ts` for Next.js
  - [x] Start scheduler on server startup (NEXT_RUNTIME=nodejs)

- [x] Task 5: Verify build
  - [x] Run `npm run build` successfully

## Dev Notes

### Scheduling Options for Next.js

Next.js App Router doesn't have built-in cron support. Options:
1. **node-cron** - In-process scheduler (simple, works with single instance)
2. **External cron** - System cron or Docker cron
3. **Vercel Cron** - If deploying to Vercel

For self-hosted Docker deployment, node-cron is simplest.

### Scheduler Interface

```typescript
interface SyncScheduler {
  start(): void
  stop(): void
  runNow(): Promise<SyncResult>
  getStatus(): SchedulerStatus
}

interface SchedulerStatus {
  isRunning: boolean
  lastRun: Date | null
  lastResult: SyncResult | null
  nextRun: Date | null
}
```

### References

- [Source: docs/planning-artifacts/epics.md#Story 7.4]
- [Source: docs/planning-artifacts/epics.md#NFR32]
- [Source: src/lib/services/billetweb-service.ts]

---

## Change Log

| Date | Change | Reason |
|------|--------|--------|
| 2026-02-01 | Story created | Fourth story in Epic 7 |
| 2026-02-01 | Implementation complete | All tasks done |
| 2026-02-01 | Code review passed | Fixed H1 (isFull), H2 (tests), M1 (shutdown), M2 (race condition) |

## Dev Agent Record

### File List

- `src/lib/services/sync-scheduler.ts` - Created: Scheduler with 15-min interval, logging, status tracking
- `src/lib/services/sync-scheduler.test.ts` - Created: Unit tests (10 tests)
- `src/lib/services/billetweb-service.ts` - Modified: Added isFull update during sync
- `src/instrumentation.ts` - Created: Next.js instrumentation to start scheduler on server boot
- `src/app/api/billetweb/sync/route.ts` - Modified: Added scheduler status to GET, manual trigger via scheduler

### Code Review Fixes Applied

- **H1**: Added `isFull: places.left === 0` to formation/stage updates in billetweb-service
- **H2**: Created 10 unit tests for sync-scheduler (start, stop, trigger, errors, concurrency)
- **M1**: Added graceful shutdown handlers (SIGTERM/SIGINT)
- **M2**: Added syncInProgress lock to prevent concurrent sync operations
