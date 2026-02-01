/**
 * Sync Scheduler Service
 * Story 7.4: Create Scheduled Sync Job
 *
 * Covers:
 * - AC1: Sync runs every 15 minutes
 * - AC2: Errors are logged (NFR32)
 * - AC3: Job can be triggered manually
 */

import { billetwebService } from './billetweb-service'
import type { SyncResult } from '@/lib/validations/billetweb'

// Sync interval: 15 minutes
const SYNC_INTERVAL_MS = 15 * 60 * 1000

// Lock to prevent concurrent sync operations (M2 fix)
let syncInProgress = false

/**
 * Scheduler status tracking
 */
export interface SchedulerStatus {
  isRunning: boolean
  lastRun: Date | null
  lastResult: SyncResult | null
  lastError: string | null
  nextRun: Date | null
  runCount: number
}

/**
 * Singleton scheduler state
 */
let schedulerState: {
  intervalId: ReturnType<typeof setInterval> | null
  status: SchedulerStatus
} = {
  intervalId: null,
  status: {
    isRunning: false,
    lastRun: null,
    lastResult: null,
    lastError: null,
    nextRun: null,
    runCount: 0
  }
}

/**
 * Format date for logging
 */
function formatLogDate(date: Date): string {
  return date.toISOString()
}

/**
 * Run the sync job with comprehensive logging (NFR32)
 * Includes lock to prevent concurrent executions (M2 fix)
 */
async function runSync(): Promise<SyncResult> {
  // Prevent concurrent sync operations
  if (syncInProgress) {
    console.log('[SyncScheduler] Sync already in progress, skipping')
    return {
      synced: 0,
      failed: 0,
      errors: ['Sync already in progress'],
      duration: 0
    }
  }

  syncInProgress = true
  const startTime = new Date()
  console.log(`[SyncScheduler] Starting sync at ${formatLogDate(startTime)}`)

  try {
    const result = await billetwebService.syncAllEvents()

    schedulerState.status.lastRun = startTime
    schedulerState.status.lastResult = result
    schedulerState.status.lastError = null
    schedulerState.status.runCount++
    schedulerState.status.nextRun = new Date(Date.now() + SYNC_INTERVAL_MS)

    // Log completion
    const endTime = new Date()
    const durationSec = (result.duration / 1000).toFixed(2)

    if (result.failed > 0) {
      console.warn(`[SyncScheduler] Sync completed with errors at ${formatLogDate(endTime)}`, {
        synced: result.synced,
        failed: result.failed,
        duration: `${durationSec}s`,
        errors: result.errors
      })
    } else {
      console.log(`[SyncScheduler] Sync completed successfully at ${formatLogDate(endTime)}`, {
        synced: result.synced,
        failed: result.failed,
        duration: `${durationSec}s`
      })
    }

    return result
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    schedulerState.status.lastRun = startTime
    schedulerState.status.lastError = errorMessage
    schedulerState.status.runCount++
    schedulerState.status.nextRun = new Date(Date.now() + SYNC_INTERVAL_MS)

    console.error(`[SyncScheduler] Sync failed at ${formatLogDate(new Date())}`, {
      error: errorMessage,
      code: 'SYNC_SCHEDULER_ERROR'
    })

    // Return error result
    return {
      synced: 0,
      failed: 1,
      errors: [errorMessage],
      duration: Date.now() - startTime.getTime()
    }
  } finally {
    syncInProgress = false
  }
}

/**
 * Start the sync scheduler
 * Called from instrumentation.ts on server startup
 */
export function startScheduler(): void {
  if (schedulerState.intervalId) {
    console.log('[SyncScheduler] Scheduler already running')
    return
  }

  // Check if Billetweb is configured
  if (!billetwebService.isConfigured()) {
    console.warn('[SyncScheduler] Billetweb API not configured, scheduler disabled')
    return
  }

  console.log('[SyncScheduler] Starting scheduler with 15-minute interval')
  schedulerState.status.isRunning = true
  schedulerState.status.nextRun = new Date(Date.now() + SYNC_INTERVAL_MS)

  // Register shutdown handlers for graceful cleanup (M1 fix)
  registerShutdownHandlers()

  // Run initial sync after a short delay (give server time to fully start)
  setTimeout(() => {
    console.log('[SyncScheduler] Running initial sync')
    runSync()
  }, 5000) // 5 second delay

  // Schedule recurring sync
  schedulerState.intervalId = setInterval(() => {
    runSync()
  }, SYNC_INTERVAL_MS)

  console.log('[SyncScheduler] Scheduler started successfully')
}

/**
 * Stop the sync scheduler
 */
export function stopScheduler(): void {
  if (schedulerState.intervalId) {
    clearInterval(schedulerState.intervalId)
    schedulerState.intervalId = null
    schedulerState.status.isRunning = false
    schedulerState.status.nextRun = null
    console.log('[SyncScheduler] Scheduler stopped')
  }
}

/**
 * Manually trigger a sync (AC3)
 */
export async function triggerSync(): Promise<SyncResult> {
  console.log('[SyncScheduler] Manual sync triggered')
  return runSync()
}

/**
 * Get current scheduler status
 */
export function getSchedulerStatus(): SchedulerStatus {
  return { ...schedulerState.status }
}

/**
 * Check if scheduler is active
 */
export function isSchedulerRunning(): boolean {
  return schedulerState.status.isRunning
}

/**
 * Register graceful shutdown handlers (M1 fix)
 * Called automatically when scheduler starts
 */
function registerShutdownHandlers(): void {
  const shutdown = () => {
    console.log('[SyncScheduler] Received shutdown signal, stopping scheduler')
    stopScheduler()
    process.exit(0)
  }

  // Handle termination signals
  process.on('SIGTERM', shutdown)
  process.on('SIGINT', shutdown)
}
