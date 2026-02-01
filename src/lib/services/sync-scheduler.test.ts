/**
 * Sync Scheduler Tests
 * Story 7.4: Create Scheduled Sync Job
 *
 * Tests scheduler logic and status tracking
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

// Mock billetweb-service
vi.mock('./billetweb-service', () => ({
  billetwebService: {
    isConfigured: vi.fn(() => true),
    syncAllEvents: vi.fn(() => Promise.resolve({
      synced: 5,
      failed: 0,
      errors: [],
      duration: 1000
    }))
  }
}))

// Import after mocking
import {
  startScheduler,
  stopScheduler,
  triggerSync,
  getSchedulerStatus,
  isSchedulerRunning
} from './sync-scheduler'
import { billetwebService } from './billetweb-service'

describe('SyncScheduler', () => {
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()
    // Stop any running scheduler
    stopScheduler()
  })

  afterEach(() => {
    stopScheduler()
  })

  describe('getSchedulerStatus', () => {
    it('returns initial status when not started', () => {
      const status = getSchedulerStatus()

      expect(status.isRunning).toBe(false)
      expect(status.lastRun).toBeNull()
      expect(status.lastResult).toBeNull()
      expect(status.nextRun).toBeNull()
      expect(status.runCount).toBe(0)
    })
  })

  describe('isSchedulerRunning', () => {
    it('returns false when scheduler not started', () => {
      expect(isSchedulerRunning()).toBe(false)
    })
  })

  describe('startScheduler', () => {
    it('does not start if Billetweb is not configured', () => {
      vi.mocked(billetwebService.isConfigured).mockReturnValue(false)

      startScheduler()

      expect(isSchedulerRunning()).toBe(false)
    })

    it('starts scheduler when Billetweb is configured', () => {
      vi.mocked(billetwebService.isConfigured).mockReturnValue(true)

      startScheduler()

      expect(isSchedulerRunning()).toBe(true)
      const status = getSchedulerStatus()
      expect(status.nextRun).not.toBeNull()
    })

    it('does not start twice', () => {
      vi.mocked(billetwebService.isConfigured).mockReturnValue(true)

      startScheduler()
      startScheduler() // Second call should be ignored

      expect(isSchedulerRunning()).toBe(true)
    })
  })

  describe('stopScheduler', () => {
    it('stops a running scheduler', () => {
      vi.mocked(billetwebService.isConfigured).mockReturnValue(true)
      startScheduler()
      expect(isSchedulerRunning()).toBe(true)

      stopScheduler()

      expect(isSchedulerRunning()).toBe(false)
      const status = getSchedulerStatus()
      expect(status.nextRun).toBeNull()
    })
  })

  describe('triggerSync', () => {
    it('runs sync and returns result', async () => {
      const result = await triggerSync()

      expect(result.synced).toBe(5)
      expect(result.failed).toBe(0)
      expect(billetwebService.syncAllEvents).toHaveBeenCalled()
    })

    it('updates status after sync', async () => {
      await triggerSync()

      const status = getSchedulerStatus()
      expect(status.lastRun).not.toBeNull()
      expect(status.lastResult).not.toBeNull()
      expect(status.runCount).toBeGreaterThan(0)
    })

    it('handles errors gracefully', async () => {
      vi.mocked(billetwebService.syncAllEvents).mockRejectedValueOnce(
        new Error('API Error')
      )

      const result = await triggerSync()

      expect(result.failed).toBe(1)
      expect(result.errors).toContain('API Error')

      const status = getSchedulerStatus()
      expect(status.lastError).toBe('API Error')
    })

    it('prevents concurrent sync operations', async () => {
      // Make sync take some time
      vi.mocked(billetwebService.syncAllEvents).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({
          synced: 5,
          failed: 0,
          errors: [],
          duration: 1000
        }), 100))
      )

      // Start two syncs simultaneously
      const sync1 = triggerSync()
      const sync2 = triggerSync()

      const [result1, result2] = await Promise.all([sync1, sync2])

      // One should succeed, one should be skipped
      const skipped = [result1, result2].find(r => r.errors.includes('Sync already in progress'))
      expect(skipped).toBeDefined()
    })
  })
})
