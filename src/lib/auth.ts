/**
 * Authentication utilities for Node.js runtime
 * This module includes bcrypt for password hashing which only works in Node.js
 *
 * For Edge runtime (middleware), use auth-edge.ts directly
 */
import bcrypt from 'bcrypt'

// Re-export JWT functions from Edge-compatible module
export { signJWT, verifyJWT } from './auth-edge'
export type { JWTPayload } from './auth-edge'

// Configuration
const SALT_ROUNDS = 10

/**
 * Hash a plain text password using bcrypt
 * @param password - Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * Compare a plain text password with a hashed password
 * @param password - Plain text password
 * @param hash - Hashed password from database
 * @returns True if passwords match, false otherwise
 */
export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Extract admin context from request headers (set by middleware)
 * Story 3.2: Helper for admin API routes
 *
 * Middleware (Story 2.3) attaches admin info to headers after JWT validation.
 * This helper extracts that context for use in API routes.
 *
 * @param request - Next.js request with middleware headers
 * @returns Admin context or null if not authenticated
 */
export function getAdminFromRequest(request: Request): { adminId: string; email: string } | null {
  const adminId = request.headers.get('x-admin-id')
  const email = request.headers.get('x-admin-email')

  if (!adminId || !email) {
    return null
  }

  return { adminId, email }
}
