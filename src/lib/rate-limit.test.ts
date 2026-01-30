/**
 * Unit tests for rate limiting
 * H2 fix: Add rate limit tests
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { isRateLimited, recordFailedAttempt, resetRateLimit, getRemainingAttempts } from './rate-limit'

describe('rate-limit', () => {
  const testIdentifier = 'test@example.com'

  beforeEach(() => {
    // Reset rate limit before each test
    resetRateLimit(testIdentifier)
  })

  describe('isRateLimited', () => {
    it('should return false for new identifier', () => {
      expect(isRateLimited(testIdentifier)).toBe(false)
    })

    it('should return false for less than 5 attempts', () => {
      recordFailedAttempt(testIdentifier)
      recordFailedAttempt(testIdentifier)
      recordFailedAttempt(testIdentifier)

      expect(isRateLimited(testIdentifier)).toBe(false)
    })

    it('should return true after 5 failed attempts', () => {
      for (let i = 0; i < 5; i++) {
        recordFailedAttempt(testIdentifier)
      }

      expect(isRateLimited(testIdentifier)).toBe(true)
    })
  })

  describe('getRemainingAttempts', () => {
    it('should return 5 for new identifier', () => {
      expect(getRemainingAttempts(testIdentifier)).toBe(5)
    })

    it('should decrease with each failed attempt', () => {
      expect(getRemainingAttempts(testIdentifier)).toBe(5)

      recordFailedAttempt(testIdentifier)
      expect(getRemainingAttempts(testIdentifier)).toBe(4)

      recordFailedAttempt(testIdentifier)
      expect(getRemainingAttempts(testIdentifier)).toBe(3)
    })

    it('should return 0 after 5 attempts', () => {
      for (let i = 0; i < 5; i++) {
        recordFailedAttempt(testIdentifier)
      }

      expect(getRemainingAttempts(testIdentifier)).toBe(0)
    })
  })

  describe('resetRateLimit', () => {
    it('should reset attempts counter', () => {
      recordFailedAttempt(testIdentifier)
      recordFailedAttempt(testIdentifier)
      recordFailedAttempt(testIdentifier)

      expect(getRemainingAttempts(testIdentifier)).toBe(2)

      resetRateLimit(testIdentifier)

      expect(getRemainingAttempts(testIdentifier)).toBe(5)
      expect(isRateLimited(testIdentifier)).toBe(false)
    })

    it('should unblock rate limited identifier', () => {
      for (let i = 0; i < 5; i++) {
        recordFailedAttempt(testIdentifier)
      }

      expect(isRateLimited(testIdentifier)).toBe(true)

      resetRateLimit(testIdentifier)

      expect(isRateLimited(testIdentifier)).toBe(false)
    })
  })
})
