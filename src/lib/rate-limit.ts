/**
 * Simple in-memory rate limiter for login attempts
 * Tracks failed login attempts by identifier (IP or email)
 */

interface RateLimitEntry {
  count: number
  firstAttempt: number
  blockedUntil?: number
}

const attempts = new Map<string, RateLimitEntry>()

// Configuration
const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const BLOCK_DURATION_MS = 15 * 60 * 1000 // 15 minutes

/**
 * Check if identifier is rate limited
 * @param identifier - Unique identifier (IP address or email)
 * @returns true if rate limited, false if allowed
 */
export function isRateLimited(identifier: string): boolean {
  const now = Date.now()
  const entry = attempts.get(identifier)

  if (!entry) {
    return false
  }

  // Check if currently blocked
  if (entry.blockedUntil && now < entry.blockedUntil) {
    return true
  }

  // Check if window has expired
  if (now - entry.firstAttempt > WINDOW_MS) {
    attempts.delete(identifier)
    return false
  }

  // Check if max attempts reached
  return entry.count >= MAX_ATTEMPTS
}

/**
 * Record a failed login attempt
 * @param identifier - Unique identifier (IP address or email)
 */
export function recordFailedAttempt(identifier: string): void {
  const now = Date.now()
  const entry = attempts.get(identifier)

  if (!entry) {
    // First attempt
    attempts.set(identifier, {
      count: 1,
      firstAttempt: now
    })
    return
  }

  // Check if window has expired
  if (now - entry.firstAttempt > WINDOW_MS) {
    // Reset counter
    attempts.set(identifier, {
      count: 1,
      firstAttempt: now
    })
    return
  }

  // Increment counter
  entry.count++

  // Block if max attempts reached
  if (entry.count >= MAX_ATTEMPTS) {
    entry.blockedUntil = now + BLOCK_DURATION_MS
  }
}

/**
 * Reset rate limit for identifier (on successful login)
 * @param identifier - Unique identifier
 */
export function resetRateLimit(identifier: string): void {
  attempts.delete(identifier)
}

/**
 * Get remaining attempts before rate limit
 * @param identifier - Unique identifier
 * @returns number of remaining attempts
 */
export function getRemainingAttempts(identifier: string): number {
  const entry = attempts.get(identifier)
  if (!entry) {
    return MAX_ATTEMPTS
  }

  const now = Date.now()
  if (now - entry.firstAttempt > WINDOW_MS) {
    return MAX_ATTEMPTS
  }

  return Math.max(0, MAX_ATTEMPTS - entry.count)
}

/**
 * Cleanup old entries (run periodically)
 */
export function cleanupRateLimits(): void {
  const now = Date.now()
  for (const [identifier, entry] of attempts.entries()) {
    if (now - entry.firstAttempt > WINDOW_MS && (!entry.blockedUntil || now > entry.blockedUntil)) {
      attempts.delete(identifier)
    }
  }
}

// Cleanup every 5 minutes
setInterval(cleanupRateLimits, 5 * 60 * 1000)
